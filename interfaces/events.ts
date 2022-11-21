export default interface IEvents {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    userId: string;
    img_url: string;
    selected_date: string;
    place_id: string;
    place_lat: string;
    place_lng: string;
    team_id: number;
    category_id: object;
    filter: Function;
}
