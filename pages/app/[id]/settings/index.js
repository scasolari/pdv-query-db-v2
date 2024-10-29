import LayoutTopBar from "@/components/layout/layoutTopBar";
import {setOrganization, setProfile} from "@/redux/actions/main";
import {connect} from "react-redux";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useEffect, useState} from "react";
import {toast} from "sonner"
import OrganizationAvatar from "@/components/organizationAvatar";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/router";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Label} from "@/components/ui/label";

function Settings(props) {
    const router = useRouter()
    const {profile, organization, setOrganization} = props
    const [name, setName] = useState(organization?.name);
    const [email, setEmail] = useState("");
    const [members, setMembers] = useState([]);
    const [deleteText, setDeleteText] = useState("");
    const [invitations, setInvitations] = useState([]);
    const fetchMembers = () => {
        axios.get(`/api/member?organizationId=${organization?.id}`)
            .then((res) => {
                setMembers(res.data)
            })
    }
    const fetchInvitations = () => {
        axios.post(`/api/invitation`, {email: profile?.user?.email})
            .then((res) => {
                setInvitations(res.data)
            })
    }
    const addMember = (e) => {
        e.preventDefault()
        if (email === profile?.user?.email) {
            toast.error("You can't add yourself in the organization.");
            return null
        }
        axios.post("/api/member/add", {
            email: email,
            id: organization?.id,
            name: organization?.name,
            organizationOwner: organization?.organizationOwner,
        })
            .then((res) => {
                setEmail("")
                fetchMembers()
            })
            .catch((error) => {
                console.log(error.response.data)
                toast.error(error.response.data.message)
            })
    }
    const deleteOrganization = () => {
        axios.post(`/api/organization/delete/${organization.id}`)
            .then(() => {
                router.push("/app/overview")
                setOrganization(null)
            })
    }

    useEffect(() => {
        fetchInvitations()
        fetchMembers()
    }, []);
    const updateOrganization = (e) => {
        e.preventDefault()
        axios.post(`/api/organization/${organization?.id}`, {
            name: name
        })
            .then((res) => {
                console.log(res.data)
                setOrganization({
                    id: res.data.id,
                    name: res.data.name,
                    organizationOwner: organization?.organizationOwner,
                });
                toast.success("Organization name updated successfully.");
            })
    }
    return <LayoutTopBar title="Settings">
        <div className="sm:w-4/12 flex flex-col gap-5">
            <Card className="shadow-none bg-gray-100/30 dark:bg-white/5 dark:bord dark:border-gray-700/30">
                <CardHeader>
                    <CardTitle className="text-lg">
                        Name
                    </CardTitle>
                    <CardDescription className="text-base">
                        The name of your workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex items-center gap-3" onSubmit={updateOrganization}>
                        <Input required className="bg-white dark:bg-black/40 shadow-none" value={name}
                               onChange={(e) => setName(e.target.value)}/>
                        <Button
                            type="submit"
                            className="bg-gray-100 hover:bg-gray-200/70 shadow-none border hover:border-gray-300 w-fit dark:bg-gray-100/10  dark:border-gray-100/10 dark:hover:bg-gray-100/15"
                            variant="secondary">Save</Button>
                    </form>
                </CardContent>
            </Card>
            <Card className="shadow-none bg-gray-100/30 dark:bg-white/5 dark:bord dark:border-gray-700/30">
                <CardHeader>
                    <CardTitle className="text-lg">
                        Members
                    </CardTitle>
                    <CardDescription className="text-base">
                        Workspace members can collaborate on the projects owned by this workspace. They can
                        create, delete, and modify projects, and can invite or remove other members.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <form className="flex items-center gap-3" onSubmit={addMember}>
                        <Input required type="email" className="bg-white dark:bg-black/40 shadow-none" value={email}
                               onChange={(e) => setEmail(e.target.value)}/>
                        <Button type="submit"
                                className="bg-gray-100 hover:bg-gray-200/70 shadow-none border hover:border-gray-300 w-fit dark:bg-gray-100/10  dark:border-gray-100/10 dark:hover:bg-gray-100/15"
                                variant="secondary">Invite member</Button>
                    </form>
                    {members?.length > 0
                        ? <div className={`flex flex-col gap-3`}>
                            {members?.map((d, i) => {
                                return <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <OrganizationAvatar profile={d.email} size={20}/>
                                        <div className="flex items-center gap-2">
                                            {d.email}
                                            {d.email === profile?.user?.email
                                                ? <Badge variant="secondary"
                                                         className="border border-gray-200 dark:border-gray-100/10">
                                                    you
                                                </Badge>
                                                : <Badge variant="secondary"
                                                         className="border border-gray-200 dark:border-gray-100/10">
                                                    {d.status}
                                                </Badge>
                                            }
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                        : null
                    }
                </CardContent>
            </Card>
            {profile?.user?.email === organization?.organizationOwner
                ? <Card className="shadow-none bg-gray-100/30 dark:bg-white/5 dark:bord dark:border-gray-700/30">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Danger zone
                        </CardTitle>
                        <CardDescription className="text-base">
                            Delete the workspace <span
                            className="font-semibold text-black dark:text-white">{organization?.name}</span>, and all of
                            its associated settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Dialog onOpenChange={() => setDeleteText("")}>
                            <DialogTrigger>
                                <Button
                                    className="bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                    type="submit"
                                    variant="destructive">
                                    Delete
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your workspace
                                        and remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogBody className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-sm">Type &quot;delete&quot; to proceed</Label>
                                        <Input
                                            value={deleteText}
                                            onChange={(e) => setDeleteText(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        disabled={deleteText !== "delete"}
                                        onClick={() => deleteText === "delete" ? deleteOrganization() : null}
                                        className="w-fit border border-red-600 text-white hover:bg-red-600 hover:text-white"
                                        type="submit"
                                        variant="destructive">
                                        Delete
                                    </Button>
                                </DialogBody>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
                : null
            }
        </div>
    </LayoutTopBar>
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile.profile,
        organization: state.organization.organization,
    };
};

const mapDispatchToProps = {
    setProfile,
    setOrganization,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
