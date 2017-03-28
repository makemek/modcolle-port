package
{
   import connection.api_port.PortAPI;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.net.URLLoader;
   import flash.net.URLRequest;
   import flash.system.fscommand;

   public class Core extends Sprite
   {
      private var member:int;
      private var callback:String;

      public function Core()
      {
         var api_port:String = null;
         super();
         trace("Running");
         var port:PortAPI = new PortAPI();
         this.parseFlashvars();
         api_port = port.__(this.member,port._createKey());
         this.sendBackResult(api_port);
      }

      private function parseFlashvars() : void
      {
         var memberStr:String = null;
         if(loaderInfo.loaderURL.match(/^file:/))
         {
            memberStr = stage.loaderInfo.parameters.memberId;
            this.callback = stage.loaderInfo.parameters.callbackUrl;
         }
         else
         {
            memberStr = root.loaderInfo.parameters.memberId;
            this.callback = root.loaderInfo.parameters.callbackUrl;
         }
         this.callback = unescape(unescape(this.callback));
         this.member = int(parseInt(memberStr));
      }

      private function sendBackResult(api_port:String) : void
      {
         var destination:String = this.callback.concat("&api_port=",api_port);
         var request:URLRequest = new URLRequest(destination);
         var urlLoader:URLLoader = new URLLoader();
         trace(destination);
         urlLoader.addEventListener(Event.COMPLETE,this.onComplete);
         urlLoader.load(request);
      }

      private function onComplete(e:Event) : void
      {
         fscommand("quit");
      }
   }
}
