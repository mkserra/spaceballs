
'use strict';

export class Color	// static class
{
	static isYellow(r, g, b)
	{
		let ret = r > 1.25 * b && g > 1.25 * b;

		ret &= Math.abs(r - g) < 30;

		return (ret && Color.intensity(r, g, b) > 128);
	}

	static intensity(r, g, b)
	{
		return (r + g + b) / 3;
	}
}
