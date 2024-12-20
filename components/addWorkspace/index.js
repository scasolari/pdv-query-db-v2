import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import axios from "axios";
import {setOrganization, setOrganizations} from "@/redux/actions/main";
import {connect} from "react-redux";
import {useRouter} from "next/router";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {BiPlus} from "react-icons/bi";
import {toast} from "sonner";
import organization from "@/redux/reducers/organization";

function OrganizationAdd(props) {
    const [open, setOpen] = useState(false);
    const {organizations, setOrganizations, setOrganization, organization} = props;
    const [form, setForm] = useState({
        name: ""
    })
    const router = useRouter();
    const addOrganization = (e) => {
        e.preventDefault()
        toast.promise(
            axios.post("/api/organization/add", { form: form })
                .then((res) => {
                    setOrganizations([...organizations, res.data]);
                    setOrganization({
                        id: res.data.id,
                        name: res.data.name,
                        organizationOwner: res.data.email,
                    });
                    setOpen(false);
                    router.push(`/app/${res.data.id}`);
                }),
            {
                loading: `Adding workspace ${form.name}...`,
                success: `Workspace ${form.name} added successfully!`,
                error: "Failed to add workspace. Please try again.",
            }
        );
    }
    const resetDialog = () => {
        setOpen(!open)
        setForm({
            name: "",
        })
    }

    return <div>
        <Dialog open={open} onOpenChange={resetDialog}>
            <DialogTrigger>
                <BiPlus
                    className="transition duration-0 hover:duration-150 text-gray-500 dark:text-muted-foreground hover:text-black hover:cursor-pointer hover:dark:text-white"
                    size={18}/>
            </DialogTrigger>
            <DialogContent>
                <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-semibold">
                                Create workspace
                            </h1>
                        </div>
                    </div>
                    <form onSubmit={addOrganization}>
                        <div className="flex flex-col gap-1 mb-5">
                            <Label className="font-semibold text-sm text-gray-500 dark:text-muted-foreground">Workspace
                                name</Label>
                            <Input
                                className="bg-gray-100 dark:bg-gray-100/5 border-0 focus-visible:ring-0 focus:ring-0 shadow-none"
                                required
                                value={form.name}
                                onChange={(e) => setForm({
                                    ...form,
                                    name: e.target.value
                                })}
                            />
                        </div>
                        <div>
                            <Button type="submit" className="border shadow-sm">
                                Create workspace
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    </div>
}

const mapStateToProps = (state) => {
    return {
        organizations: state.organizations.organizations,
        organization: state.organization.organization,
    };
};

const mapDispatchToProps = {
    setOrganizations,
    setOrganization
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationAdd);
