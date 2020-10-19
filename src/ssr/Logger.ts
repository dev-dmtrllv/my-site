export class Logger
{
	private static ref: any = {};
	private static isDisabled: boolean = false;

	public static disable()
	{
		if(!this.isDisabled)
		{
			this.isDisabled = true;
			for(const fn in console)
			{
				this.ref[fn] = (console as any)[fn];
				(console as any)[fn] = () => {};
			}
		}
	}

	public static enable()
	{
		if(this.isDisabled)
		{
			this.isDisabled = false;
			for(const fn in console)
			{
				(console as any)[fn] = this.ref[fn];
			}
		}
	}
}
