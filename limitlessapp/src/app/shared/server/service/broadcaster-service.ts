import { Injectable } from '@angular/core';
import { Http,Headers, Response,RequestOptions,URLSearchParams } from '@angular/http';
import {AppSettings} from '../api/api-settings'
import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Broadcasters } from "../../models/broadcasters";
import { ChannelVideoKeyRequest } from "../../models/channelVideoKeyRequest";
import { BroadcasterVideos } from "../../models/broadcasterVideos";
import { CreateResponse } from "../../models/createResponse";
import { headerDict} from "../../models/header";
import { wowzaheaderDict} from "../../models/wowza-header";
import { StreamTargetRequest } from "../../models/stream-target-request";

const headerObj = {                                                                                                                                                                                 
  headers: new Headers(headerDict)
  
};

const wowzaHeader={
    wowzaHeader:new Headers(wowzaheaderDict)
};

@Injectable()
export class BroadcasterService {
    constructor(private http: Http) {
    }

    getAllBroadcasters(): Observable<Broadcasters> {

        return this.http.get(AppConfig.get_Broadcasters, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

   getAllBroadcastersById(broadcasterId:number): Observable<Broadcasters>{
        return this.http.get(AppConfig.get_BroadcastersById+broadcasterId,headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

    getAllBroadcastersByCategoryId(broadcasterId:number,channelCategoryId:number): Observable<BroadcasterVideos>{
        return this.http.get(AppConfig.get_BroadcastersByCategoryId+broadcasterId+"/"+channelCategoryId,headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

     createBroadcasterVideos(broadcasterVideos:BroadcasterVideos): Observable<CreateResponse> {

        return this.http.post(AppConfig.new_BroadcasterVideokey,broadcasterVideos, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    updateCategoryVideosKey(channelvideokeyrequest:ChannelVideoKeyRequest): Observable<CreateResponse> {

        return this.http.put(AppConfig.update_BroadcasterVideokey,channelvideokeyrequest,headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    deleteStreamTarget(applicationName:string)
    {
          return this.http.get(AppConfig.delete_streamTarget+applicationName+"/applicationNamelive/pushpublish/mapentries/ppsource", wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

     createStreamTarget(streamTargetRequest:StreamTargetRequest,applicationName:string)
    {
          return this.http.post(AppConfig.create_streamTarget+applicationName+"/applicationNamelive/pushpublish/mapentries/ppsource", streamTargetRequest,wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

    
}