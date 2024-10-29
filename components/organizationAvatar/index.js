import Avatar from "boring-avatars";

export default function OrganizationAvatar({profile, size}) {
    return <Avatar name={profile} variant="beam" size={size || 24}/>
}
