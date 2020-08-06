
'use strict';

import {  UI  } from './UI.js';
import { Util } from '../Util.js';

export class Ring
{
	constructor(p, r, g, b, radius, destructor)
	{
		this.p = p;
		this.r = r;		// red
		this.g = g;		// green
		this.b = b;		// blue
		this.a = 0.8;	// alpha

		this.rad = radius;
		this.id  = Util.rand(999999999);   // 100 IDs = 0.000005 chance collision

		this.destructor = destructor.bind(this);
	}

	draw(gc)
	{
		gc.strokeStyle = 'rgba(' + this.r + ',' + this.g + ','
			+ this.b + ',' + this.a + ')';

		gc.lineWidth = 2.0 * UI.getScale();

		gc.beginPath();
		gc.arc(this.p.x, this.p.y, this.rad, 0, 2 * Math.PI);
		gc.closePath();
		gc.stroke();
	}

	update()
	{
		this.r = Math.min(255, this.r + 2);
		this.g = Math.min(255, this.g + 2);
		this.b = Math.min(255, this.b + 2);

		this.a -= 0.007;

		if (this.a < 0)
		{
			this.destructor();
		}
	}
}
