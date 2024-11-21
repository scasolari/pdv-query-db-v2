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

function PageSettings(props) {
    const router = useRouter()
    const {id} = router.query
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
        console.log("Page ID: ", id)
    }, [router.query, id]);
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
    return <LayoutTopBar>
        <div className="sm:w-[600px] w-full m-auto flex flex-col gap-5">
            <Card className="border-none shadow-none">
                <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base">
                            Workspace name
                        </CardTitle>
                        <CardDescription >
                            The name of your workspace.
                        </CardDescription>
                    </div>
                    <OrganizationAvatar profile={organization?.name} size={36}/>
                </CardHeader>
                <CardContent className="px-0">
                    <form className="flex items-center gap-3" onSubmit={updateOrganization}>
                        <Input
                            required
                            className="bg-white dark:bg-black/40 shadow-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={organization?.organizationOwner !== profile?.user?.email}
                        />
                        <Button
                            disabled={organization?.organizationOwner !== profile?.user?.email}
                            type="submit"
                            className="bg-gray-100 hover:bg-gray-200/70 shadow-none border hover:border-gray-300 w-fit dark:bg-gray-100/10  dark:border-gray-100/10 dark:hover:bg-gray-100/15"
                            variant="secondary">Save</Button>
                    </form>
                </CardContent>
            </Card>
            <Card className="border-none shadow-none">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-base">
                        Members
                    </CardTitle>
                    <CardDescription>
                        Workspace members can collaborate on the projects owned by this workspace. They can
                        create, delete, and modify projects, and can invite or remove other members.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 px-0">
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
                                                         className="border border-gray-200 dark:border-gray-100/10 capitalize">
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
                ? <Card className="border-none shadow-none">
                <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-base">
                            Danger zone
                        </CardTitle>
                        <CardDescription>
                            Delete the workspace <span
                            className="font-semibold text-black dark:text-white">{organization?.name}</span>, and all of
                            its associated settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
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
                                    <DialogTitle className="text-base">Are you absolutely sure?</DialogTitle>
                                    <DialogDescription className="text-sm">
                                        This action cannot be undone. This will permanently delete your workspace
                                        &quot;{organization?.name}&quot; and remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogBody className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <Input
                                            placeholder={`Type "${organization?.name}" to proceed`}
                                            className="bg-gray-100 dark:bg-gray-100/5 border-0 focus-visible:ring-0 focus:ring-0 shadow-none"
                                            value={deleteText}
                                            onChange={(e) => setDeleteText(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        disabled={deleteText !== organization?.name}
                                        onClick={() => deleteText === organization?.name ? deleteOrganization() : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(PageSettings);
