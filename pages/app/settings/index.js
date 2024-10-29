import LayoutTopBar from "@/components/layout/layoutTopBar";
import axios from "axios";
import {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import OrganizationAvatar from "@/components/organizationAvatar";
import { toast } from "sonner"
import {setOrganization, setOrganizations} from "@/redux/actions/main";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

function Settings(props) {
    const {profile, organizations, setOrganizations, setOrganization} = props
    const [invitations, setInvitations] = useState([]);
    const fetchOrganizations = () => {
        axios.get("/api/organization").then((response) => {
            setOrganizations(response.data);
        })
    }
    useEffect(() => {
        fetchInvitations()
    }, []);
    const fetchInvitations = () => {
        axios.post(`/api/invitation`, {email: profile?.user?.email})
            .then((res) => {
                setInvitations(res.data)
            })
    }
    const acceptInvitation = (id) => {
        axios.post(`/api/invitation/add`, {id: id})
            .then(() => {
                fetchInvitations()
                fetchOrganizations()
            })
            .catch((err) => {
                toast.error(err.response.data.message)
            })
    }
    return <LayoutTopBar title="Settings">
        <div className="sm:w-4/12 flex flex-col gap-5">
            <Card className="shadow-none bg-gray-100/30 dark:bg-white/5 dark:bord dark:border-gray-700/30">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">
                            Public profile
                        </CardTitle>
                        <CardDescription className="text-base">
                            Your personal account.
                        </CardDescription>
                    </div>
                    <OrganizationAvatar profile={profile?.user?.name} size={36}/>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Label className="w-20">Name</Label>
                            <Input
                                readOnly
                                className="bg-white dark:bg-black/40 shadow-none"
                                value={profile?.user?.name}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Label className="w-20">Email</Label>
                            <Input
                                readOnly
                                className="bg-white dark:bg-black/40 shadow-none"
                                value={profile?.user?.email}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Label className="w-20">Provider</Label>
                            <Input
                                readOnly
                                className="bg-white dark:bg-black/40 shadow-none"
                                value={profile?.user?.provider}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-none bg-gray-100/30 dark:bg-white/5 dark:bord dark:border-gray-700/30">
                <CardHeader>
                    <CardTitle className="text-lg">
                    Workspaces
                    </CardTitle>
                    <CardDescription className="text-base">
                        Workspace members can collaborate on the projects owned by this workspace. They can create, delete, and modify projects, and can invite or remove other members.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <div>
                        <p className="font-semibold">Pending invitation</p>
                        {invitations?.length > 0
                            ? <div className={`flex flex-col gap-3 mt-3`}>
                                {invitations?.map((d, i) => {
                                    return <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <OrganizationAvatar profile={d.organizationName} size={20}/>
                                            <div className="flex items-center gap-2">
                                                {d.organizationName}
                                            </div>
                                        </div>
                                        {d.status === "pending"
                                            ? <div
                                                className="!text-xs font-semibold bg-gray-100 px-2 py-0.5 border border-gray-200 rounded-md hover:bg-gray-200/70 hover:cursor-pointer dark:bg-gray-100/10 dark:border-gray-100/10 dark:hover:bg-gray-100/15"
                                                onClick={() => acceptInvitation(d.id)}>
                                                Accept
                                            </div>
                                            : null
                                        }
                                    </div>
                                })}
                            </div>
                            : <p className="text-muted-foreground">No workspaces invited.</p>
                        }
                    </div>
                    <div>
                        <p className="font-semibold">Workspaces joined</p>
                        {organizations?.length > 0
                            ? <div className={`flex flex-col gap-3 mt-3`}>
                                {organizations?.map((d, i) => {
                                    return <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <OrganizationAvatar profile={d.name} size={20}/>
                                            <Link href={`/app/${d.id}/overview`} onClick={() => {
                                                setOrganization({
                                                    id: d.id,
                                                    name: d.name,
                                                    organizationOwner: d.email,
                                                })
                                            }} className="flex items-center gap-2 hover:underline">
                                                {d.name}
                                            </Link>
                                        </div>
                                        {d.status === "pending"
                                            ? <div
                                                className="!text-xs font-semibold bg-gray-100 px-2 py-0.5 border border-gray-200 rounded-md hover:bg-gray-200 hover:cursor-pointer"
                                                onClick={() => acceptInvitation(d.id)}>
                                                Accept
                                            </div>
                                            : null
                                        }
                                    </div>
                                })}
                            </div>
                            : <p className="text-muted-foreground">No workspaces joined.</p>
                        }
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-none bg-gray-100/30 dark:bg-white/5 dark:bord dark:border-gray-700/30">
                <CardHeader>
                    <CardTitle className="text-lg">
                        Danger zone
                    </CardTitle>
                    <CardDescription className="text-base">
                        Delete account, and all of
                        its associated settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex items-center gap-3">
                        <Button
                            className="bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                            type="submit"
                            variant="destructive">
                            Delete account
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </LayoutTopBar>
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile.profile,
        organizations: state.organizations.organizations,
        organization: state.organization.organization
    };
};

const mapDispatchToProps = {
    setOrganizations,
    setOrganization
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
