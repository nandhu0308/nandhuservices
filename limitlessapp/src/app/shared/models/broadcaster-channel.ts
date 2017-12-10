import { BroadcasterVideos } from '../models/broadcasterVideos';
import { DestinationRequest} from '../models/destination-request';
export class BroadcasterChannel {
    id: number;
    application_id: number;
    broadcaster_id: number;
    lang_id: number;
    category_id: number;
    channel_name: string;
    channel_description: string;
    yt_streamtarget_name: string;
    fb_streamtarget_name: string;
    ha_streamtarget_name: string;
    channel_image: string;
    ha_channel_image: string;
    image_file_name: string;
    rank: number;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    is_hd: boolean = false;
    ha_rank: number = 1;
    ha_is_active: boolean = true;
    deprecated: boolean = false;
    fb_platform_img:string;
    yt_platform_img:string;
    ha_platform_img:string;
    ps_platform_img:string;
    fb1_platform_img:string;
    fb2_platform_img:string;
    fb3_platform_img:string;
    fb4_platform_img:string;
    fb5_platform_img:string;
    videos: BroadcasterVideos[];
    destination: DestinationRequest[];
}

