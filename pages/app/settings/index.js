import LayoutTopBar from "@/components/layout/layoutTopBar";
import axios from "axios";
import {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import OrganizationAvatar from "@/components/organizationAvatar";
import { toast } from "sonner"
import {setOrganization, setOrganizations, setPendingInvitation} from "@/redux/actions/main";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {signOut} from "next-auth/react";

function Settings(props) {
    const {profile, organizations, setOrganizations, setOrganization, pending_invitation, setPendingInvitation} = props
    const [userName, setUserName] = useState(profile?.user?.name);
    const fetchOrganizations = () => {
        axios.get("/api/organization").then((response) => {
            setOrganizations(response.data);
        })
    }
    const acceptInvitation = (id) => {
        axios.post(`/api/invitation/add`, {id: id})
            .then(() => {
                setPendingInvitation([])
                fetchOrganizations()
            })
            .catch((err) => {
                toast.error(err.response.data.message)
            })
    }
    const updateUserName = (e) => {
        e.preventDefault();
        if(!profile) return null
        axios.post(`/api/profile/update`, {
            id: profile?.user?.id,
            name: userName,
        }).then(() => {
            signOut({callbackUrl: "/app/sanity"}).then()
        })
    }

    return <LayoutTopBar>
        <div className="sm:w-4/12 m-auto flex flex-col gap-5">
            <Card className="border-none shadow-none">
                <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base">
                            Public profile
                        </CardTitle>
                        <CardDescription>
                            Your personal account.
                        </CardDescription>
                    </div>
                    <OrganizationAvatar profile={profile?.user?.name} size={36}/>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="flex flex-col gap-3">
                        <form onSubmit={updateUserName} className="flex items-center gap-3">
                            <Input
                                className="bg-white dark:bg-black/40 shadow-none"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <Button
                                type="submit"
                                className="bg-gray-100 hover:bg-gray-200/70 shadow-none border hover:border-gray-300 w-fit dark:bg-gray-100/10  dark:border-gray-100/10 dark:hover:bg-gray-100/15"
                                variant="secondary">Update</Button>
                        </form>
                        <div className="text-xs text-gray-500 mb-3">
                            If you update the user name, you will be automatically sign-out from current session.
                        </div>
                        <div className="flex items-center gap-3">
                            <Label className="w-20">Email</Label>
                            {profile?.user?.email}
                        </div>
                        <div className="flex items-center gap-3">
                            <Label className="w-20">Provider</Label>
                            {profile?.user?.provider}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-none">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-base">
                        Workspaces
                    </CardTitle>
                    <CardDescription>
                        Workspace members can collaborate on the projects owned by this workspace. They can create,
                        delete, and modify projects, and can invite or remove other members.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 px-0">
                    <div>
                        <p className="font-semibold">Pending invitation</p>
                        {pending_invitation?.length > 0
                            ? <div className={`flex flex-col mt-3`}>
                                {pending_invitation?.map((d, i) => {
                                    return <div key={i}
                                                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-100/10">
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
                            : <p className="text-muted-foreground py-3">No workspaces invited.</p>
                        }
                    </div>
                    <div>
                        <p className="font-semibold">Workspaces joined</p>
                        {organizations?.length > 0
                            ? <div className={`flex flex-col mt-3`}>
                                {organizations?.map((d, i) => {
                                    return <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-100/10">
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
                            : <p className="text-muted-foreground py-3">No workspaces joined.</p>
                        }
                    </div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-none">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-base">
                        Danger zone
                    </CardTitle>
                    <CardDescription>
                        Delete account, and all of
                        its associated settings.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
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
        organization: state.organization.organization,
        pending_invitation: state.pending_invitation.pending_invitation
    };
};

const mapDispatchToProps = {
    setOrganizations,
    setOrganization,
    setPendingInvitation
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
