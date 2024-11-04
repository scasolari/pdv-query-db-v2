import {useEffect, useState} from "react";
import {toast} from "sonner";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {BiLoaderAlt} from "react-icons/bi";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {setDatabase, setDatabases} from "@/redux/actions/main";
import {connect} from "react-redux";
import {Link} from "lucide-react";

function AddDatabase(props) {
    const {setDatabases, databases, setDatabase} = props
    const [open, setOpen] = useState(false);
    const [testLoading, setTestLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: "",
        settings: "",
        isLocalhost: false,
        dbUserPermission: ""
    })
    const dataPermissions = [
        {
            id: 1,
            label: "Read/Write",
            value: "read_write",
        },
        {
            id: 2,
            label: "Write-only",
            value: "write_only",
        },
        {
            id: 3,
            label: "Read-only",
            value: "read_only",
        },
        {
            id: 4,
            label: "Admin",
            value: "admin",
        }
    ]
    const testDbConnection = () => {
        if(form.settings.length === 0) {
            toast.warning(`Database connection string not must be empty.`)
            return
        }
        setTestLoading(true)
        axios.post(`/api/database/check-db`, {
            form: form
        }).then((r) => {
            toast.success(r.data.message)
            setTestLoading(false)
        }).catch((r) => {
            console.log(r)
            toast.warning(`${r.response?.data?.message} ${r.response?.data?.error?.original?.sqlMessage || r.response?.data?.error?.original?.code}`)
            setTestLoading(false)
        })
    }

    console.log("Databases: ", databases)
    const addDatabase = (e) => {
        e.preventDefault()
        setLoading(true)
        axios.post(`/api/database/add`, {
            form: form
        }).then((res) => {
            toast.success(`Database "${res.data.name}" added successfully.`)
            setDatabases([res.data, ...databases]);
            resetDialog()
        }).catch((res) => {
            console.log(res.response.data.message)
            toast.warning(res.response.data.message)
            setLoading(false)
        })
    }

    const resetDialog = () => {
        setOpen(!open)
        setForm({
            name: "",
            settings: "",
            isLocalhost: false,
            dbUserPermission: ""
        })
        setLoading(false)
    }

    return <>
        <Dialog open={open} onOpenChange={resetDialog}>
            <DialogTrigger>
                <Button className="border" onClick={() => setOpen(true)}>
                    <Link/> Link Database
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Link database</DialogTitle>
                </DialogHeader>
                <form onSubmit={addDatabase} autoComplete="off">
                    <div className="mb-5">
                        <label className="text-sm mb-1 flex">Database name *</label>
                        <Input
                            className="bg-gray-100 dark:bg-gray-100/5 border-0 focus-visible:ring-0 shadow-none"
                            required={true}
                            disabled={loading}
                            value={form.name}
                            onChange={(e) => setForm({
                                ...form,
                                name: e.target.value
                            })}
                        />
                        <p className="text-muted-foreground text-xs leading-4 mt-1">
                            Please avoid entering any sensitive or personal information in this field for your
                            security
                            and privacy.
                        </p>
                    </div>
                    <div className="mb-5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm mb-1 flex">Database connection string *</label>
                            <div className="flex items-center gap-1">
                                <div className="w-[16px]">
                                    {testLoading
                                        ? <div className="animate-spin">
                                            <BiLoaderAlt size={16}/>
                                        </div>
                                        : null
                                    }
                                </div>
                                <div>
                                    <Button className="p-0 mb-1 h-auto" type="button" variant="text"
                                            onClick={() => testDbConnection()}>
                                            <span>
                                                Test connection
                                            </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-[15px]">
                            <Input
                                className="bg-gray-100 dark:bg-gray-100/5 border-0 focus-visible:ring-0 shadow-none"
                                required={true}
                                disabled={loading}
                                value={form.settings}
                                onChange={(e) => setForm({
                                    ...form,
                                    settings: e.target.value
                                })}
                                placeholder="postgres://user:pass@example.com:5432/dbname"
                            />
                        </div>
                        <p className="text-muted-foreground text-xs leading-4 mt-1">
                            Your database url is required only once during database setup and will not be
                            requested
                            again. Your security is our priority.
                        </p>
                    </div>
                    <div className="mb-5">
                        <label className="text-sm mb-1 flex">Database user permission *</label>
                        <Select
                            required
                            onValueChange={(e) => setForm({
                                ...form,
                                dbUserPermission: e
                            })}
                            disabled={loading}
                        >
                            <SelectTrigger className="bg-gray-100 dark:bg-gray-100/5 border-0 focus-visible:ring-0 focus:ring-0 shadow-none">
                                <SelectValue placeholder="Select permission..."/>
                            </SelectTrigger>
                            <SelectContent>
                                {dataPermissions?.map(d => {
                                    return <SelectItem key={d.id} value={d.value} className="text-[12px] hover:cursor-pointer">{d.label}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                        <p className="text-muted-foreground text-xs leading-4 mt-1">
                            User permission must match the database permission.
                        </p>
                    </div>
                    <div className="mb-5">
                        <div className="items-top flex space-x-2">
                            <Checkbox id="terms1" onCheckedChange={(e) => setForm({
                                ...form,
                                isProdDb: e
                            })} disabled={loading}/>
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="terms1"
                                    className="text-sm leading-none"
                                >
                                    Is production database
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    Specify if the database string url is a production database.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-5">
                        <p className="text-xs text-muted-foreground">
                            *Required
                        </p>
                    </div>
                    <div>
                        <Button type="submit" disabled={loading} className="lg:w-fit w-full">
                            {loading ? "Loading..." : "Link database"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </>
}

const mapStateToProps = (state) => {
    return {
        databases: state.databases.databases,
        database: state.database.database,
    };
};

const mapDispatchToProps = {
    setDatabases,
    setDatabase
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDatabase);
