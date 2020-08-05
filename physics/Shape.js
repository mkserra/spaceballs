
'use strict';

export class Shape
{
	constructor(center)
	{
		this.mAngle  = 0;
		this.mCenter = center;

		gEngine.Core.mAllObjects.push(this);
	}

	update()
	{
		// TODO
		/*if (this.mCenter.y < gEngine.Core.mHeight)
		{
			this.move(new Vec2(0, 1));
		}*/
	}

	remove()
	{
	}
}

