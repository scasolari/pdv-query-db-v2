import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import axios from "axios";
import {setOrganization, setOrganizations} from "@/redux/actions/main";
import {connect} from "react-redux";
import {useRouter} from "next/router";

function OrganizationAdd(props) {
    const {organizations, setOrganizations, setOrganization} = props;
    const [form, setForm] = useState({
        name: ""
    })
    const router = useRouter();
    const addOrganization = (e) => {
        e.preventDefault()
        axios.post("/api/organization/add", {form: form})
            .then((res) => {
                setOrganizations([...organizations, res.data]);
                setOrganization({
                    id: res.data.id,
                    name: res.data.name,
                    organizationOwner: res.data.email,
                })
                router.push(`/app/${res.data.id}/overview`);
            })
    }
    useEffect(() => {
        setOrganization(null)
    }, []);
    return <div>
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
                    <Label className="font-semibold text-sm text-gray-500 dark:text-muted-foreground">Workspace name</Label>
                    <Input
                        className="bg-gray-100/5 border-0 focus-visible:ring-0"
                        required
                        value={form.name}
                        onChange={(e) => setForm({
                            ...form,
                            name: e.target.value
                        })}
                    />
                </div>
                <div>
                    <Button type="submit" variant="secondary" className="border shadow-sm">
                        Create workspace
                    </Button>
                </div>
            </form>
        </div>
    </div>
}

const mapStateToProps = (state) => {
    return {
        organizations: state.organizations.organizations,
    };
};

const mapDispatchToProps = {
    setOrganizations,
    setOrganization
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationAdd);
