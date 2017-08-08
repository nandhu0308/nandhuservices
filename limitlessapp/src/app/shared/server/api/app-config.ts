import {AppSettings} from '../api/api-settings'

export class AppConfig  { 

//Delete stream target
public static delete_streamTarget="http://live.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

public static create_streamTarget="http://live.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

public static get_streamTarget="http://live.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

  // Application Config   
  public static get_Appl=AppSettings.API_ENDPOINT +"application";
  public static new_Appl=AppSettings.API_ENDPOINT +"new";
  public static amend_Appl=AppSettings.API_ENDPOINT +"update";
  
  //Category Config
  public static get_Category=AppSettings.API_ENDPOINT +"product/category/all";//should be pass "all" as to server
  public static new_Category=AppSettings.API_ENDPOINT +"product/category/new"; //to pass "new"" as to server
  public static amend_Category=AppSettings.API_ENDPOINT +"product/category/live"; // to pass "live" as to server
  public static getid_category=AppSettings.API_ENDPOINT +"product/category/get"; // to pass "live" as to server
  
  //Sub-Category Config
  public static get_Subcategory=AppSettings.API_ENDPOINT +"product/subcategory/all/";
  public static new_Subcategory=AppSettings.API_ENDPOINT +"product/subcategory/new";
  public static get_subcategory_by_id = AppSettings.API_ENDPOINT + "product/subcategory/get/";
  public static amend_Subcategory=AppSettings.API_ENDPOINT +"product/subcategory/update";

  //Product Config
  public static get_Products=AppSettings.API_ENDPOINT +"product/all";
  public static get_ProductById=AppSettings.API_ENDPOINT +"product/get/";
  public static new_Product=AppSettings.API_ENDPOINT +"new";
  public static amend_Product=AppSettings.API_ENDPOINT +"update";

  //Broadcasters Config
  public static get_BroadcasterDest=AppSettings.API_ENDPOINT +"broadcaster/destination/all";
   public static get_Broadcasters=AppSettings.API_ENDPOINT +"broadcaster/all";
   public static get_BroadcastersById=AppSettings.API_ENDPOINT +"broadcaster/get/";
   public static get_BroadcastersByCategoryId=AppSettings.API_ENDPOINT +"broadcaster/get/";
   public static update_BroadcasterytVideokey=AppSettings.API_ENDPOINT +"broadcaster/broadcasterytVideo/update"; //to pass "new"" as to server
   public static update_BroadcasterfbVideokey=AppSettings.API_ENDPOINT +"broadcaster/broadcasterfbVideo/update"; //to pass "new"" as to server
   public static update_BroadcasterhaVideokey=AppSettings.API_ENDPOINT +"broadcaster/broadcasterhaVideo/update"; //to pass "new"" as to server

   public static new_BroadcasterVideokey=AppSettings.API_ENDPOINT +"broadcaster/broadcasterVideo/new"; //to pass "new"" as to server
   public static new_BroadcasterOnBoard=AppSettings.API_ENDPOINT +"broadcaster/broadcasterwithchannel/create"; //to pass "new"" as to server
   public static get_BroadcasterChannel=AppSettings.API_ENDPOINT +"broadcaster/broadcasterchannel/all"; //to pass "new"" as to server
   public static get_ChannelCategory=AppSettings.API_ENDPOINT +"broadcaster/broadcastercategory/all"; //to pass "new"" as to server

   //Document Type Config
   
   public static get_DocumentType=AppSettings.API_ENDPOINT +"document/all"; //to pass "new"" as to server

   
  //Common Config
   public static get_country=AppSettings.API_ENDPOINT +"common/country/all"; //to get all countries
   public static get_state=AppSettings.API_ENDPOINT +"common/state/all/"; //to get all state
   public static get_city=AppSettings.API_ENDPOINT +"common/city/all/"; //to get all city
   public static get_rank=AppSettings.API_ENDPOINT +"common/rank/all/"; //to get all ranks


};