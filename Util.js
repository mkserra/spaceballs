
'use strict';

export class Util
{
	constructor() { }

	static rand(m, n)	  // interval [n, m)
	{
		n = n === undefined ? 0 : n;

		return Math.floor(Math.random() * (n - m)) + m;
	}

	static randSign()
	{
		return Math.random() < 0.5 ? 1 : -1;
	}

	static zero(n)
	{
		return 0.001 > n && n > -0.001;
	}

	static dist(p, q)
	{
		return Math.pow(q.x - p.x, 2) + Math.pow(q.y - p.y, 2);
	}

	static contains(arr, item)
	{
		for (let i = 0; i < arr.length; i++)
		{
			if (arr[i].id == item.id)
			{
				return true;
			}
		}
		return false;
	}

	static remove(arr, item)
	{
		return arr.filter(function(b)
		{
			return b.id != item.id;
		});
	}
}

