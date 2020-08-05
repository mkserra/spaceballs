
'use strict';

import { Ring } from './Ring.js';
import { Util } from '../Util.js';
import { Vec2 } from '../physics/Vec2.js';

export class Ball
{
	static RADIUS = 12;

	constructor(p, r, g, b, radius, destructor, velocityScale, options)
	{
		this.p = p;		// initial position Vec2
		this.r = r;		// red
		this.g = g;		// green
		this.b = b;		// blue
		this.a = 0.8;	// alpha

		this.rad = radius;

		this.id = Util.rand(999999999);   // 100 IDs = 0.000005 chance collision

		const s = velocityScale || 1;  // set initial velocity

		this.v = new Vec2(Util.randSign() * ((Math.random() + 0.25) * s),
			Util.randSign() * ((Math.random() + 0.25) * s));

		const opts = options || {};

		this.ringQuotient = opts.leaveRings ? Util.rand(30, 70) : 0;

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
	}

	update(xres, yres)
	{
		this.move(xres, yres);
		this.explosion();		// does nothing if ball not yet burst
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
			if (n < ANIM_N / 2.25)
			{
				this.r = Math.floor(this.r - dR);
				this.g = Math.floor(this.g - dG);
				this.b = Math.floor(this.b - dB);

				this.rad += dRad;
				dRad     -= ddRad;
				n++;
			}
			else if (n < ANIM_N / 1.19)
			{
				if (n % this.ringQuotient === 0)
				{
					traceHandler(this.makeRing(traceDestructor));
				}
				this.a   -= dA;
				this.rad -= dRad;
				dRad     += ddRad * 2;
				n++;
			}
			else  // animation done
			{
				this.destructor();
			}
		};
	}

	makeRing(destructor)
	{
		const r = this.r;
		const g = this.g;
		const b = this.b;

		return new Ring(this.p, r, g, b, this.rad, destructor);
	}

	collides(ball)
	{
		return Util.dist(this.p, ball.p) < Math.pow(this.rad + ball.rad, 2);
	}
}

