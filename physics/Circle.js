
'use strict';

import { Shape } from './Shape';
import { Vec2  } from './Vec2';

export class Circle extends Shape
{
	constructor(center, radius)
	{
		super(center);

		this.mType	 = 'Circle';
		this.mRadius = radius;
		this.mStartP = new Vec2(center.x, center.y - radius);
	}

	draw(context)
	{
		context.beginPath();
		context.arc(this.mCenter.x, this.mCenter.y, this.mRadius, 0, Math.PI *  2, true);
		context.moveTo(this.mStartP.x, this.mStartP.y);
		context.lineTo(this.mCenter.x, this.mCenter.y);
		context.closePath();
		context.stroke();
	}

	move(v)
	{
		this.mStartP = this.mStartP.add(v);
		this.mCenter = this.mCenter.add(v);

		return this;
	}

	rotate(angle)
	{
		this.mAngle += angle;
		this.mStartP = this.mStartP.rotate(this.mCenter, angle);

		return this;
	}
}

