
'use strict';

import { Ring  } from './Ring.js';
import { Spark } from './Spark.js';
import {  UI   } from './UI.js';
import { Util  } from '../Util.js';
import { Vec2  } from '../physics/Vec2.js';


export class Ball
{
	static RADIUS = 12;

	constructor(p, r, g, b, destructor, options)
	{
		this.p = p;		// initial position Vec2
		this.r = r;		// red
		this.g = g;		// green
		this.b = b;		// blue
		this.a = 0.8;	// alpha

		this.rad = Ball.RADIUS * UI.getScale();

		this.id = Util.rand(999999999);   // 100 IDs = 0.000005 chance collision

		const x = (Math.random() + 0.25) * (UI.getScale() - 0.15);
		const y = (Math.random() + 0.25) * (UI.getScale() - 0.15);

		this.v = new Vec2(Util.randSign() * x, Util.randSign() * y);

		this.icy = b > 1.25 * r && b > 1.25 * g;
		this.iceTime = 0;

		const opts = options || {};

		this.ringMod  = (opts.leaveRings && !this.icy) ? Util.rand(30, 70) : 0;
		this.sparkMod = opts.sparks ? Util.rand(2, 11) : 0;

		this.explosion  = () => null;
		this.destructor = destructor.bind(this);
	}

	bounds()
	{
		return {
			x:  this.p.x - this.rad,
			y:  this.p.y - this.rad,
			x2: this.p.x + this.rad,
			y2: this.p.y + this.rad
		};
	}

	draw(gc)
	{
		gc.fillStyle = 'rgba(' + this.r + ',' + this.g + ','
			+ this.b + ',' + this.a + ')';

		gc.beginPath();
		gc.arc(this.p.x, this.p.y, this.rad, 0, 2 * Math.PI);
		gc.closePath();
		gc.fill();

		if (this.iceTime > 1)  // show icy ring when frozen
		{
			gc.strokeStyle = 'rgba(200, 200, 240, ' + 1.3 * this.a + ')';
			gc.lineWidth   = 3.0;

			gc.beginPath();
			gc.arc(this.p.x, this.p.y, this.rad, 0, 2 * Math.PI);
			gc.closePath();
			gc.stroke();
		}
	}

	update(xres, yres)
	{
		if (this.iceTime > 1)  // ball is frozen
		{
			this.iceTime--;
			return;
		}
		this.move(xres, yres);
		this.explosion();
	}

	explode(traceHandler, traceDestructor)
	{
		const ANIM_N = 250;  // animation frame total

		const dR = this.r / ANIM_N;
		const dG = this.g / ANIM_N;
		const dB = this.b / ANIM_N;
		const dA = 0.9 / ANIM_N;

		let dRad = this.rad * 9 / ANIM_N;
		let n = 0;

		const ddRad = dRad / 150;

		this.explosion = function()
		{
			n++;

			if (n < ANIM_N / 2.25)  // explosion expanding
			{
				if (n % this.sparkMod === 0)
				{
					traceHandler(this.makeSpark(traceDestructor));
				}
				this.r = Math.floor(this.r - dR);
				this.g = Math.floor(this.g - dG);
				this.b = Math.floor(this.b - dB);

				this.rad += dRad;
				dRad     -= ddRad;
			}
			else if (n < ANIM_N / 1.19)  // explosion shrinking
			{
				if (n % this.ringMod === 0)
				{
					traceHandler(this.makeRing(traceDestructor));
				}
				if (this.icy && n % 50 === 0)
				{
					this.iceTime = Util.rand(32, 120);
				}
				this.a   -= dA;
				this.rad -= dRad;
				dRad     += ddRad * 2;
			}
			else  // animation done
			{
				this.destructor();
			}
		};
	}

	move(xres, yres)
	{
		this.p = this.p.add(this.v);

		const p = this.bounds();

		if (p.x < 1 || p.x2 > xres - 1)
		{
			this.v.x *= -1;
		}
		else if (p.y < 1 || p.y2 > yres - 1)
		{
			this.v.y *= -1;
		}
	}

	makeRing(destructor)
	{
		const r = this.r;
		const g = this.g;
		const b = this.b;

		return new Ring(this.p, r, g, b, this.rad, destructor);
	}

	makeSpark(destructor)
	{
		const dR = Math.max(this.r, Math.max(this.g, this.b)) === this.r ? 170 : 100;
		const dG = Math.max(this.g, Math.max(this.r, this.b)) === this.g ? 170 : 100;
		const dB = Math.max(this.b, Math.max(this.g, this.r)) === this.b ? 170 : 100;

		const r = Math.min(255, this.r + dR);
		const g = Math.min(255, this.g + dG);
		const b = Math.min(255, this.b + dB);

		const x = Util.rand(1, 11 * UI.getScale());
		const y = Util.rand(1, 11 * UI.getScale());

		const o = new Vec2(x, y).rotate(new Vec2(0, 0), Util.rand(1, 364));

		return new Spark(this.p, o, r, g, b, destructor);
	}

	collides(ball)
	{
		return Util.dist(this.p, ball.p) < Math.pow(this.rad + ball.rad, 2);
	}
}

