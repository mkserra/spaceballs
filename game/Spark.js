
'use strict';

import {  UI  } from './UI.js';
import { Util } from '../Util.js';

export class Spark
{
	static MOTION_TIME = 9;  // measured in frames

	constructor(p, v, r, g, b, destructor)
	{
		this.p = p;  // starting point
		this.v = v;  // velocity
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = 0.9;

		this.dR = Math.max(r, Math.max(g, b)) === r ? 0 : 1;
		this.dG = Math.max(g, Math.max(r, b)) === g ? 0 : 1;
		this.dB = Math.max(b, Math.max(g, r)) === b ? 0 : 1;

		this.rad  = Util.rand(1, 4 * UI.getScale());
		this.life = 0;

		this.id = Util.rand(999999999);   // 100 IDs = 0.000005 chance collision

		this.destructor = destructor.bind(this);
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

	update()
	{
		if (this.life < Spark.MOTION_TIME)
		{
			this.life++;
			this.p = this.p.add(this.v);
		}
		if (this.a < 0)
		{
			this.destructor();
		}
		this.r = Math.max(35, this.r - this.dR);
		this.g = Math.max(35, this.g - this.dG);
		this.b = Math.max(35, this.b - this.dB);

		this.a -= 0.0025;
	}
}
