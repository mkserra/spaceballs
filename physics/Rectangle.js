
'use strict';

import { Shape } from './Shape';
import { Vec2  } from './Vec2';

export class Rectangle extends Shape
{
	constructor(center, width, height)
	{
		super(center);

		this.mType		 = 'Rectangle';
		this.mWidth		 = width;
		this.mHeight	 = height;
		this.mVertex	 = [];
		this.mFaceNormal = [];

		// vertices, clockwise from top-left
		this.mVertex[0] = new Vec2(center.x - width / 2, center.y - height / 2);
		this.mVertex[1] = new Vec2(center.x + width / 2, center.y - height / 2);
		this.mVertex[2] = new Vec2(center.x + width / 2, center.y + height / 2);
		this.mVertex[3] = new Vec2(center.x - width / 2, center.y + height / 2);

		this._updateFaces();
	}

	draw(context)
	{
		context.save();
		context.translate(this.mVertex[0].x, this.mVertex[0].y);
		context.rotate(this.mAngle);
		context.strokeRect(0, 0, this.mWidth, this.mHeight);
		context.restore();
	}

	move(v)
	{
		for (let i = 0; i < this.mVertex.length; i++)
		{
			this.mVertex[i] = this.mVertex[i].add(v);
		}
		this.mCenter = this.mCenter.add(v);

		return this;
	}

	rotate(angle)
	{
		this.mAngle += angle;

		for (let i = 0; i < this.mVertex.length; i++)
		{
			this.mVertex[i] = this.mVertex[i].rotate(this.mCenter, angle);
		}
		this._updateFaces()

		return this;
	}

	//------------------------ private methods --------------------------

	_updateFaces()  // clockwise from top
	{
		this.mFaceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]);
		this.mFaceNormal[0] = this.mFaceNormal[0].normalize();

		this.mFaceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]);
		this.mFaceNormal[1] = this.mFaceNormal[1].normalize();

		this.mFaceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]);
		this.mFaceNormal[2] = this.mFaceNormal[2].normalize();

		this.mFaceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]);
		this.mFaceNormal[3] = this.mFaceNormal[3].normalize();
	}
}

