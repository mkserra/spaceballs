
'use strict';

import { Ball } from './Ball.js';
import { Util } from '../Util.js';
import {  UI  } from './UI.js';
import { Vec2 } from '../physics/Vec2.js';

const VIEW_W = Math.max($(document).width()  || 0, window.innerWidth  || 0);
const VIEW_H = Math.max($(document).height() || 0, window.innerHeight || 0);

const PLAYFIELD_W = 1280;
const PLAYFIELD_H = 800;

var canvas_w = PLAYFIELD_W;
var canvas_h = PLAYFIELD_H;

var x_margin = (VIEW_W - canvas_w) / 2;
var y_margin = (VIEW_H - canvas_h) / 2;

const SIZE = 80;   // initial number of balls

var balls	= [];  // live balls
var bursts	= [];  // exploding balls
var traces	= [];  // inert objects
var score	= 0;
var begun	= false;  // for game-phase logic

var gc = $('#canvas')[0].getContext('2d');

gc.canvas.width  = canvas_w;
gc.canvas.height = canvas_h;

export const main = function()
{
	adaptToViewport();
	$('#canvas').click(clickHandler());

	for (let i = 0; i < SIZE; i++)
	{
		balls.push(makeBall());
	}
	gameLoop();
};

const adaptToViewport = function()
{
	if (VIEW_W < PLAYFIELD_W || VIEW_H < PLAYFIELD_H)  // small screen
	{
		canvas_w = VIEW_W - 64;
		canvas_h = VIEW_H - 64;

		x_margin = (VIEW_W - canvas_w) / 2;
		y_margin = (VIEW_H - canvas_h) / 2;

		gc.canvas.width  = canvas_w;	// For some reason, this
		gc.canvas.height = canvas_h;	// resets the canvas font..?

		UI.setScale(VIEW_W / PLAYFIELD_W);
	}
	$('#canvas').css('border', '1px solid white');
	$('#canvas').css('margin-left', x_margin);
	$('#canvas').css('margin-top',  y_margin);
};

const gameLoop = function()
{
	let mCurrentTime;
	let mElapsedTime;

	let mPreviousTime = Date.now();
	let mLagTime = 0;

	const MPF = 1000 * (1 / 60);  // msecs per frame, at 60 FPS

	const go = function()
	{
		requestAnimationFrame(() => go());

		mCurrentTime  = Date.now();
		mElapsedTime  = mCurrentTime - mPreviousTime;
		mPreviousTime = mCurrentTime;
		mLagTime	 += mElapsedTime;

		while (mLagTime >= MPF)
		{
			mLagTime -= MPF;
			update();
		}
		draw();
	};
	go();
};

const update = function()
{
	if (begun && bursts.length === 0)  // game over
	{
		return;
	}
	balls.forEach((b)  => b.update(canvas_w, canvas_h));
	bursts.forEach((b) => b.update(canvas_w, canvas_h));
	traces.forEach((t) => t.update(canvas_w, canvas_h));

	findCollisions();
};

const draw = function()
{
	if (begun === null)  // awaiting new game
	{
		return;
	}
	else if (begun && bursts.length === 0)
	{
		if (endingAnimation === null)
		{
			endingAnimation = endingAnimationClosure();
		}
		endingAnimation();
	}
	else  // main loop
	{
		gc.clearRect(0, 0, canvas_w, canvas_h);
		balls.forEach((b) => b.draw(gc));
		bursts.forEach((b) => b.draw(gc));
		traces.forEach((t) => t.draw(gc));
	}
};

const makeBall = function(opts)
{
	const radius = Ball.RADIUS * UI.getScale();

	const x = Util.rand(canvas_w - radius * 2, radius * 2);
	const y = Util.rand(canvas_h - radius * 2, radius * 2);
	const r = Util.rand(220, 90);
	const g = Util.rand(220, 90);
	const b = Util.rand(220, 90);

	const options = opts || {
		leaveRings: Math.random() < 0.666,
		sparks: Math.random() < 0.45
	};

	const f = function()  // ball destructor
	{
		bursts = Util.remove(bursts, this);
	};
	return new Ball(new Vec2(x, y), r, g, b, f, options);
};

const findCollisions = function()
{
	bursts.forEach(function(ball)
	{
		balls.forEach(function(b)
		{
			if (!Util.zero(b.v.x) && !Util.contains(bursts, b) && b.collides(ball))
			{
				b.v   = { x: 0, y: 0 };
				balls = Util.remove(balls, b);

				score++;
				bursts.push(b);

				const f = function()  // trace destructor
				{
					traces = Util.remove(traces, this);
				};
				b.explode((obj) => traces.push(obj), f);
			}
		});
	});
};

const endingAnimationClosure = function()
{
	let s = new Vec2(1, 1);

	// Zoom into the centroid of the remaining traces,
	// with a bias toward the canvas center. Smaller
	// screens require a greater bias.

	const bias = [new Vec2(canvas_w / 2, canvas_h / 2)];

	for (let i = UI.getScale(); i < 1; i += 0.03)
	{
		bias.push(new Vec2(canvas_w / 2, canvas_h / 2));
	}
	const o = Vec2.centroid(traces.map((t) => t.p).concat(bias));

	return function()
	{
		const scale = UI.getScale();
		const xOff  = score.toString().length * 7.5;

		if (s.x > 1.09 - (scale < 1 ? scale * 0.025 : 0))
		{
			begun = null;
			return;
		}
		s = s.add(new Vec2(0.0015, 0.0015));

		gc.translate(o.x, o.y);
		gc.scale(s.x, s.y);
		gc.translate(-o.x, -o.y);
		gc.clearRect(0, 0, canvas_w, canvas_h);

		traces.forEach((t) => t.draw(gc));
		balls.forEach((b)  => b.draw(gc));

		gc.strokeStyle = 'rgba(255, 255, 255, 1.0)'; 
		gc.lineWidth = 1.0; 
		gc.font = Math.floor(scale * 25) + 'px monospace';

		gc.strokeText(score, o.x - xOff, o.y + 8, 90);
		gc.fillText(score,   o.x - xOff, o.y + 8, 90);
	};
};

var endingAnimation = null;

const clickHandler = function()
{
	return function(e)
	{
		if (begun === null)
		{
			window.location.reload();
		}
		if (begun)
		{
			return;
		}
		begun = true;

		const ball = makeBall({ leaveRings: true, sparks: true });

		ball.p.x = e.pageX - 10 - x_margin;
		ball.p.y = e.pageY - 10 - y_margin;
		ball.r = 200;
		ball.g = 0;
		ball.b = 0;

		ball.v = { x: 0, y: 0 };

		bursts.push(ball);

		const f = function()  // trace destructor
		{
			traces = Util.remove(traces, this);
		};
		ball.explode((obj) => traces.push(obj), f);
	};
};

