
export class Vec2
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	add(vec)
	{
		return new Vec2(vec.x + this.x, vec.y + this.y);
	}

	subtract(vec)
	{
		return new Vec2(this.x - vec.x, this.y - vec.y);
	}

	scale(n)
	{
		return new Vec2(n * this.x, n * this.y);
	}

	dot(vec)
	{
		return (this.x * vec.x + this.y * vec.y);
	}

	cross(vec)
	{
		return (this.x * vec.y - this.y * vec.x);
	}

	length()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	rotate(center, angle)  // counterclockwise
	{
		const r = [];
		const x = this.x - center.x;
		const y = this.y - center.y;

		r[0]  = x * Math.cos(angle) - y * Math.sin(angle);
		r[1]  = x * Math.sin(angle) + y * Math.cos(angle);
		r[0] += center.x;
		r[1] += center.y;

		return new Vec2(r[0], r[1]);
	}

	normalize()
	{
		let len = this.length();

		len = len > 0 ? 1 / len : len;

		return new Vec2(this.x * len, this.y * len);
	}

	distance(vec)
	{
		const x = this.x - vec.x;
		const y = this.y - vec.y;

		return Math.sqrt(x * x + y * y);
	}

	static centroid(vs)
	{
		let x = 0;
		let y = 0;

		for (let i = 0; i < vs.length; i++)
		{
			x += vs[i].x;
			y += vs[i].y;
		}
		return new Vec2(x / vs.length, y / vs.length);
	}
}

