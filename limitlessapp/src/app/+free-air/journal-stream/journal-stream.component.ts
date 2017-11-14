import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { User } from '../../shared/models/userModel';
import { LoginResponse } from '../../shared/models/loginResponse';
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../shared/models/broadcaster-channel';
import { JournalService } from '../../shared/server/service/journal.service';
import { Journal } from '../../shared/models/journal';
import { NTemplateService } from "../../shared/server/service/ntemplate-service"
import { Observable } from 'rxjs/Observable';
import { ChannelVideoKeyRequest } from "../../shared/models/channelVideoKeyRequest"
import { ChannelCategory } from "../../shared/models/channelCategory"
import { BroadcasterVideos } from "../../shared/models/broadcasterVideos"
import { CreateResponse } from "../../shared/models/createResponse";
import 'rxjs/add/observable/of';
import { NotificationService } from "../../shared/utils/notification.service";
import { StreamTargetRequest } from "../../shared/models/stream-target-request"
import { BroadcasterDestination } from "../../shared/models/broadcaster-destination"
import { StreamNotificationRequest } from "../../shared/models/stream-notify-request"
import { DatePipe } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-journal-stream',
  templateUrl: './journal-stream.component.html',
  providers: [BroadcasterService, DatePipe,NTemplateService,JournalService]
})
export class JournalStreamComponent implements OnInit {
  channlId:number;
  broadcaster_channel_id:number;
  // channelVideoKeyRequest: ChannelVideoKeyRequest;
  journalKeyRequest:ChannelVideoKeyRequest;
  bChannelVideos: Broadcasters[];
  channelCategories: ChannelCategory;
  // journalCategories: ChannelCategory;
  streamNotificationRequest: StreamNotificationRequest;
  journalStreamForm;
  user: LoginResponse;
  url: 'https://www.youtube.com/watch?v=AXcxZXJ73ZA';
  errorMessage: string;
  appid: number;
  client_id: number;
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];
  journals: Journal[];
  superAdminUser: boolean;
  broadcasterUser: boolean;
  loginResponse: LoginResponse;
  broadcasterId: number;
  journalId: number;
  streamTargetResponse;
  streamTargetRequest: StreamTargetRequest;
  createResponse: CreateResponse;
  broadcasterDestinations;
  mode: 'Observable';
  broadcasterVideos;
  g_broadcasterId;
  w_applicationName: string;
  notify_Templateid: 1;
  notify_DestinationId: 0;
  isLoopUntil:false;
  isnewKeyDisabled:false;
  channelId:number;

  constructor(private broadcasterService: BroadcasterService, private journalService: JournalService,
    private cookieService: CookieService, private fb: FormBuilder, private nTemplateService: NTemplateService
     , private notificationService: NotificationService , private datePipe: DatePipe) {
    this.superAdminUser = false;
    this.broadcasterUser = false;
    this.loginResponse = new LoginResponse();
    this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
    this.w_applicationName=localStorage.getItem('w_appname');
    this.loginResponse = JSON.parse(this.cookieService.get("HAU"));
    if (this.loginResponse.user_type === 'Entertainment') {
      this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
      this.w_applicationName = this.user.w_appname;
      this.broadcasterUser = true;
      this.superAdminUser = false;
    } else if (this.loginResponse.user_type === 'Super Admin') {
      this.superAdminUser = true;
      this.broadcasterUser = false;
      this.w_applicationName = "dev";
    }
    this.broadcasters = new Array();
    this.journalId = 0;
  }

  ngOnInit() {
    this.initForm();
    if (this.superAdminUser) {
      this.getAllBroadcasters();
    } else if (this.broadcasterUser) {
      this.getBroadcasterChannels(this.loginResponse.client_id);
    }
    this.streamNotificationRequest=new StreamNotificationRequest();
    this.getJournalsByChannelId(this.channelId);
  }

  initForm() {
    this.journalStreamForm = this.fb.group({
        journalDestinationnewKey: [null, [Validators.required, Validators.maxLength(300)]],
        journalDestinationcurKey: [null, [Validators.required]],
        // journalDestinationName: [null, [Validators.required]],
        channelJournalName: [null, [Validators.required]],
        broadcasterName: [null, [Validators.required]],
        broadcasterChannelCategoryName: [this.user.primary_channel_id ? this.user.primary_channel_id : 140, Validators.required],        
        broadcasterDestination: [null, Validators.required],
        channelVideoId: [null],
    });
  }

  getAllBroadcasters() {
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        this.broadcasters = broadcasters;
        console.log(this.broadcasters);
      },
      error => {
        console.log(error);
      }
    );
  }

  getBroadcasterChannels(broadcasterId: number) {
    this.broadcasterService.getChannelsByBroadcasterId(broadcasterId).subscribe(
      broadcasterChannels => {
        this.broadcasterChannels = broadcasterChannels;
        console.log(this.broadcasterChannels);
      },
      error => {
        console.log(error);
      }
    );
  }

  getJournalsByChannelId(channlId:number) {
    console.log("journalid"+this.channlId);
    this.journalService.getJournalsByChannel(channlId).subscribe(
      journals => {
        this.journals = journals;
        console.log(this.journals);
      },
      error => {
        console.log(error);
      }
    );
  }

  onJournalSelect(journalId: number) 
  {
    this.journalId = journalId;
    console.log(this.journalId);
  }

  getAllBroadcasterDestination() {
    this.broadcasterService.getAllBroadcasterDestination()
      .subscribe(
      broadcasterDestination =>{
       this.broadcasterDestinations = broadcasterDestination 
       console.log(this.broadcasterDestinations);
      
      },
      
      error => this.errorMessage = <any>error);

  }


  getAllBroadcasterChannelDestination(channlId:number) {
    this.getJournalsByChannelId(channlId);
    this.broadcasterService.getAllBroadcasterChannelDestination(channlId)
      .subscribe(
      broadcasterDestination =>{
       this.broadcasterDestinations = broadcasterDestination 
       if(this.broadcasterDestinations.length>0)
        {
          this.journalStreamForm.get('broadcasterDestination').setValue(this.broadcasterDestinations[1].d_id);
          console.log("destid"+this.broadcasterDestinations[1].d_id);
        }
      },
      error => this.errorMessage = <any>error);

  }

  
  onBroadcasterSelect(broadcasterId, isLoad: boolean) {
    const broadcasterVal = this.journalStreamForm.value;
    // this.getJournalsByChannelId(broadcasterId);
    if (!isLoad && this.user.user_type == "Super Admin") {
     
      this.broadcasterService.getAllBroadcasters().subscribe(
        channelCategories => this.setChannelselectedValue(channelCategories = channelCategories),
        error => this.errorMessage = error
      );
    }
    else {
      this.broadcasterService.getAllBroadcastersById(broadcasterId).subscribe(
        channelCategories => this.setChannelselectedValue(channelCategories = channelCategories),
        error => this.errorMessage = error
      );
    }

  }
  

  updateDestinationId(destinations) {
    
    if (this.user.user_type === "Super Admin") {
      this.client_id = 1064;
      this.user.client_id = 1064;

    }

    //this.getAllBroadcastersById(this.client_id);
  }
  setChannelselectedValue(broadcasters) {
    if (broadcasters.length > 0) {
      this.broadcasters = broadcasters;
      if (this.user.user_type === "Super Admin") {

        var filterChannel = broadcasters.filter(sachannel => sachannel.id.toString() === this.journalStreamForm.value.broadcasterName.toString());
        this.channelCategories = filterChannel.length > 0 ? filterChannel[0].broadcaster_channels : [];
        this.bChannelVideos = filterChannel.length > 0 ? filterChannel[0].broadcaster_channels : [];
        // this.journalCategories = filterChannel.length > 0 ? filterChannel[0].broadcaster_channels : [];
        this.updatingResponse(filterChannel);


      }
      else {
        this.channelCategories = broadcasters[0].broadcaster_channels;
        this.bChannelVideos = broadcasters[0].broadcaster_channels;
        this.updatingResponse(broadcasters);
        // this.journalCategories = filterChannel.length > 0 ? filterChannel[0].broadcaster_channels: [];
      }
     
    }
  }

  onChannelCategorySelect(channelCategoryId) {
    const broadcasterVal = this.journalStreamForm.value;
    var broadcasterId = broadcasterVal.broadcasterName ? this.user.client_id : broadcasterVal.broadcasterName;
    this.broadcasterService.getAllBroadcastersByCategoryId(broadcasterId, channelCategoryId)
      .subscribe(broadcasterVideos => this.updatingResponse(this.broadcasterVideos = broadcasterVideos),
      error => this.errorMessage = error
      );
  }

  updatingResponse(broadcasterVideos) {
    // var broadcaster_channel_id;
    if (broadcasterVideos.length > 0) {
      var broadcasterVideo = broadcasterVideos.length > 0 && broadcasterVideos[0].broadcaster_channels.length > 0 ? broadcasterVideos[0].broadcaster_channels[0].broadcaster_videos : [];

      if (broadcasterVideo.length > 0) {
        this.user.w_appname = broadcasterVideos[0].w_application_name;
        this.w_applicationName=broadcasterVideos[0].w_application_name;
        this.isLoopUntil=broadcasterVideos[0].is_loop_until;
        this.isnewKeyDisabled=this.isLoopUntil;
        this.journalStreamForm.setValue({
          journalDestinationcurKey: null,              // broadcasterVideo[0].yt_streamkey,
          broadcasterChannelCategoryName: broadcasterVideo[0].broadcaster_channel_id,
          journalDestinationnewKey: null,
          broadcasterName: broadcasterVideos[0].id,
          channelVideoId: broadcasterVideo[0].id,
          broadcasterDestination: null,
          channelJournalName: broadcasterVideos[0].id
          
        });

        this.getAllBroadcasterChannelDestination(+ this.journalStreamForm.value.broadcasterChannelCategoryName);
        // this.getAllBroadcasterChannelDestination(+ this.journalStreamForm.value.channelJournalName);
      }

    }

  }

  amendChannelVideoKey(value: any) {
    this.showPopup(value);
  }

  stopChannelVideoKey(value: any) {
    var newKeyResponse;
    this.streamNotificationRequest=new StreamNotificationRequest();
    var destType = this.journalStreamForm.value.broadcasterDestination.toString();
    this.streamNotificationRequest.broadcaster_id = this.journalStreamForm.value.broadcasterName;
    this.streamNotificationRequest.template_id = 1;
    if (destType === "1") {
      newKeyResponse = {
        id: -1,
        fb_streamkey: this.journalStreamForm.value.journalDestinationcurKey

      }
      this.streamNotificationRequest.destination_id = 2;
    }
    else if (destType === "2") {
      newKeyResponse = {
        id: -1,
        yt_streamkey: this.journalStreamForm.value.journalDestinationcurKey

      }
      this.streamNotificationRequest.destination_id = 1;
    }
    else if (destType === "3") {
      newKeyResponse = {
        id: -1,
        ha_streamkey: this.journalStreamForm.value.journalDestinationcurKey

      }
      this.streamNotificationRequest.destination_id = 5;
    }
    else if (destType === "4") {
      newKeyResponse = {
        id: -1,
        ps_streamkey: this.journalStreamForm.value.journalDestinationcurKey

      }
       this.streamNotificationRequest.destination_id = 3;
    }
    this.streamTargetKeyResponse(newKeyResponse, value,this.streamNotificationRequest);
  }

  

  showPopup(isStop: boolean) {

    var contentValue = "";
    var selValue = this.journalStreamForm.value.broadcasterDestination.toString();
    if (selValue === "1")
      contentValue = "FaceBook";
    else if (selValue === "2")
      contentValue = "YouTube";
    else if (selValue = "3")
      contentValue = "Haappyapp";
    else if (selValue = "4")
      contentValue = "Periscope";

    this.notificationService.smartMessageBox({
      title: isStop ? "Channel Stream Stop" : "Channel Stream Key",
      content: isStop ? "Do you want to stop a <i  style='color:green'><b>" + contentValue + "<b></i> Stream ?Your stream will be stop automatically." : "Do you want to update new <i  style='color:green'><b>" + contentValue + "<b></i> Stream key?Your stream will be start automatically.",
      buttons: '[No][Yes]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {
        if (!isStop) {
          this.updateStreamkey();
        }
        else {
          console.log('Destination is continuous running! ');
          this.stopChannelVideoKey(isStop);
        }

      }
    });
  }

  updateStreamkey() {
    this.journalKeyRequest = new  ChannelVideoKeyRequest();
    this.streamNotificationRequest=new StreamNotificationRequest();
    const broadcasterVideoVal = this.journalStreamForm.value;
    this.journalKeyRequest.id = broadcasterVideoVal.channelVideoId;
    this.streamNotificationRequest.broadcaster_id = this.journalStreamForm.value.broadcasterName;
    this.streamNotificationRequest.template_id = 1;
    var type;
    var dest = broadcasterVideoVal.broadcasterDestination.toString().trim();
    switch (dest) {
      case "1": {
        type = "fb";
        this.journalKeyRequest.fb_streamkey = broadcasterVideoVal.journalDestinationnewKey.trim();
        this.streamNotificationRequest.destination_id = 2;
        break;
      }

      case "2": {
        type = "yt";
        this.journalKeyRequest.yt_streamkey = broadcasterVideoVal.journalDestinationnewKey.trim();
        this.streamNotificationRequest.destination_id = 1;
        break;
      }

      case "3": {
        type = "ha";
        this.journalKeyRequest.ha_streamkey = broadcasterVideoVal.journalDestinationnewKey.trim();
        this.streamNotificationRequest.destination_id = 5;
        break;
      }

      case "4": {
        type = "ps";
        this.journalKeyRequest.ps_streamkey = broadcasterVideoVal.journalDestinationnewKey.trim();
        this.streamNotificationRequest.destination_id = 3;
        break;
      }

      default: {
        type = "yt";
        this.journalKeyRequest.yt_streamkey = broadcasterVideoVal.journalDestinationnewKey.trim();
        this.streamNotificationRequest.destination_id = 1;
        break;
      }
    }


    this.broadcasterService.updateCategoryVideosKey(this.journalKeyRequest, type)
      .subscribe(
      createresponse => this.streamTargetKeyResponse(this.createResponse = createresponse, false,this.streamNotificationRequest),
      error => this.errorMessage = <any>error);
  }


  streamTargetKeyResponse(newKeyResponse, isStop: boolean,streamNotificationRequest) {

    this.broadcasterService.getStreamTarget(this.w_applicationName.trim(),this.journalStreamForm.value.broadcasterName)
      .subscribe(
      response => this.streamTargetGetResponse(response = response, newKeyResponse, isStop,streamNotificationRequest,this.streamNotificationRequest.broadcaster_id),
      error => this.errorMessage = <any>error);
  }
  streamTargetGetResponse(getresponse, newKeyResponse, isStop,streamNotificationRequest,broadcaster_id) {

    var myDate = new Date();
    var streamTargetVal;
    var wowzaMapEntries: any[];
    this.streamTargetRequest = new StreamTargetRequest();
    var newKeyDate = this.datePipe.transform(myDate, 'yyMMddhmmss');
    var newStreamEntryName = this.w_applicationName.toString();
    //this.user.w_appname.trim();
    //+ "-" + newKeyDate;
    if (getresponse.mapEntries.length > 0) {
      wowzaMapEntries = getresponse.mapEntries;
      var destType = this.journalStreamForm.value.broadcasterDestination.toString();
      if (destType === "1") {
        streamTargetVal = wowzaMapEntries.filter(
          destKey => destKey.host === "rtmp-api.facebook.com");
        newStreamEntryName = newStreamEntryName + "-facebook";
        this.streamTargetRequest.streamName = newKeyResponse.fb_streamkey ? newKeyResponse.fb_streamkey.toString().trim() : '';
      }
      else if (destType === "2") {
        streamTargetVal = wowzaMapEntries.filter(
          destKey => destKey.host === "a.rtmp.youtube.com");
        newStreamEntryName = newStreamEntryName + "-youtube";
        this.streamTargetRequest.streamName = newKeyResponse.yt_streamkey ? newKeyResponse.yt_streamkey.toString().trim() : '';
      }
      else if (destType === "3") {
        streamTargetVal = wowzaMapEntries.filter(
          destKey => destKey.host === "live.haappyapp.com");

        newStreamEntryName = newStreamEntryName + "-haappyapp";
        this.streamTargetRequest.streamName = "ha-mainstream";

        //this.streamTargetRequest.streamName = newKeyResponse.ha_streamkey?newKeyResponse.ha_streamkey.toString().trim():'';
      }

      else if (destType === "4") {
        streamTargetVal = wowzaMapEntries.filter(
          destKey => destKey.host.toString().endsWith(".pscp.tv"));

        newStreamEntryName = newStreamEntryName + "-Periscope";
        this.streamTargetRequest.streamName = newKeyResponse.ps_streamkey ? newKeyResponse.ps_streamkey.toString().trim() : '';
      }
      if (streamTargetVal.length > 0) {
        streamTargetVal = streamTargetVal[0];
      }
      //streamTargetVal = getresponse.mapEntries[0];

      this.streamTargetRequest.serverName = getresponse.serverName.trim();
      this.streamTargetRequest.sourceStreamName = streamTargetVal.sourceStreamName.trim();
      this.streamTargetRequest.entryName = newStreamEntryName + "-" + newKeyDate.trim();

      this.streamTargetRequest.appInstance = streamTargetVal.appInstance;

      this.streamTargetRequest.port = streamTargetVal.port;
      this.streamTargetRequest.enabled = isStop ? false : true;
      this.streamTargetRequest.autoStartTranscoder = streamTargetVal.autoStartTranscoder;
      this.streamTargetRequest.profile = streamTargetVal.profile;
      this.streamTargetRequest.host = streamTargetVal.host.trim();
      this.streamTargetRequest.application = streamTargetVal.application;
      this.streamTargetRequest.userName = streamTargetVal.userName ? streamTargetVal.userName : '';
      this.streamTargetRequest.password = streamTargetVal.password ? streamTargetVal.password : '';

    }

    this.broadcasterService.createStreamTarget(this.streamTargetRequest, this.w_applicationName.trim(), this.streamTargetRequest.entryName,broadcaster_id)
     
      .subscribe(
      response => this.streamTargetcreateResponse(response, streamTargetVal.entryName, isStop,streamNotificationRequest,broadcaster_id),
      error => this.errorMessage = <any>error)

  }

  streamTargetcreateResponse(response, entryName: string, isStop,streamNotificationRequest,broadcaster_id) {
    this.broadcasterService.deleteStreamTarget(this.w_applicationName, entryName,broadcaster_id)
      .subscribe(
      response => this.hasReload(response, isStop,streamNotificationRequest),
      error => this.errorMessage = <any>error)
  }

  refreshStreamKey() {
    

    if(this.journalStreamForm.value.broadcasterDestination !="2")
    {
       this.isLoopUntil=false;
       this.isnewKeyDisabled=false;
    }

    const broadcasterVideoKeyVal = this.journalStreamForm.value;
    var videoKeyValue;
    if (this.bChannelVideos.length > 0) {
      videoKeyValue = this.bChannelVideos.filter(
        destKey => destKey.id.toString() === broadcasterVideoKeyVal.broadcasterChannelCategoryName.toString());
    }

    if (videoKeyValue.length > 0) {

      var dest = broadcasterVideoKeyVal.broadcasterDestination.toString();
      switch (dest) {
        case "1": {
          this.journalStreamForm.get('journalDestinationcurKey').setValue(videoKeyValue[0].broadcaster_videos.length > 0 ? videoKeyValue[0].broadcaster_videos[0].fb_streamkey : '');
          break;
        }

        case "2": {
          this.journalStreamForm.get('journalDestinationcurKey').setValue(videoKeyValue[0].broadcaster_videos.length > 0 ? videoKeyValue[0].broadcaster_videos[0].yt_streamkey : '');
          break;
        }

        case "3": {

          this.journalStreamForm.get('journalDestinationcurKey').setValue(videoKeyValue[0].broadcaster_videos.length > 0 ? videoKeyValue[0].broadcaster_videos[0].ha_streamkey : '');
          break;
        }

        case "4": {

          this.journalStreamForm.get('journalDestinationcurKey').setValue(videoKeyValue[0].broadcaster_videos.length > 0 ? videoKeyValue[0].broadcaster_videos[0].ps_streamkey : '');
          break;
        }

        default: {

          this.journalStreamForm.get('journalDestinationcurKey').setValue(videoKeyValue[0].broadcaster_videos.length > 0 ? videoKeyValue[0].broadcaster_videos[0].yt_streamkey : '');
          break;
        }
       
      }
      if(this.isLoopUntil)
      {
        this.journalStreamForm.get('journalDestinationnewKey').setValue(this.journalStreamForm.value.journalDestinationcurKey);
      }
      else
      {
        this.journalStreamForm.get('journalDestinationnewKey').setValue("");
      }
    }
  }

  stopStreamNotification(streamNotificationRequest) {
    this.nTemplateService.stopStreamingNotifcation(streamNotificationRequest)
      .subscribe(
      response => {
        if (response) {
          location.reload();
        }
      },
      error => this.errorMessage = <any>error)
  }

  startStreamNotification(streamNotificationRequest) {
    this.nTemplateService.startStreamingNotifcation(streamNotificationRequest)
      .subscribe(
      response => {
        if (response) {
          location.reload();
        }
      },
      error => this.errorMessage = <any>error)
  }

  hasReload(response, isStop,streamNotificationRequest) {
    if (isStop) {
      this.stopStreamNotification(streamNotificationRequest);
    }
    else {
      this.startStreamNotification(streamNotificationRequest);
    }


  }
  
}