module fl {
	export class Context extends fl.ContextBase implements fl.IContext {
		protected _autoStartup:boolean = false;

		public constructor(contextView:egret.DisplayObjectContainer = null,autoStartup:boolean = true)
		{
			super();
			this._autoStartup = autoStartup;
			this.contextView = contextView;
		}

		public startup()
		{
			this.dispatchEvent(new fl.ContextEvent(fl.ContextEvent.STARTUP_COMPLETE));
		}

		public shutdown()
		{
			this.dispatchEvent(new fl.ContextEvent(fl.ContextEvent.SHUTDOWN_COMPLETE));
		}

		public get contextView():egret.DisplayObjectContainer
		{
			return this._contextView;
		}
		
		public set contextView(value:egret.DisplayObjectContainer)
		{
			if(value == this._contextView)
				return ;
			if(this._contextView)
				throw new ContextError(ContextError.E_CONTEXT_VIEW_OVR);
			this._contextView = value;
			this.mapInjections();
			this.checkAutoStartup();
		}

		protected mapInjections()
		{
			this.injector.mapValue(fl.IReflector,this.reflector);
			this.injector.mapValue(fl.IInjector,this.injector);
			this.injector.mapValue("egret.IEventDispatcher",this.eventDispatcher);
			this.injector.mapValue(egret.DisplayObjectContainer,this.contextView);
			this.injector.mapValue(fl.ICommandMap,this.commandMap);
			this.injector.mapValue(fl.IMediatorMap,this.mediatorMap);
			this.injector.mapValue(fl.IViewMap,this.viewMap);
			this.injector.mapClass(fl.IEventMap,fl.EventMap);
		}

		protected checkAutoStartup()
		{
			if(this._autoStartup && this.contextView)
			{
				this.contextView.stage?this.startup():this.contextView.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddedToStage,this,false,0);
			}
		}

		protected onAddedToStage(e:egret.Event)
		{
			this.contextView.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddedToStage,this);
			this.startup();
		}

		protected createInjector():fl.IInjector
		{
			var injector:fl.IInjector = new fl.Injector();
			return injector;
		}
		protected createReflector():fl.IReflector
		{
			var reflector:fl.IReflector = new fl.Reflector();
			return reflector;
		}
	}
}