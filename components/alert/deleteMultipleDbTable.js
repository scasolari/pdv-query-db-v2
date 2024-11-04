import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {setDatabase, setDatabases} from "@/redux/actions/main";
import {connect} from "react-redux";
import {useState} from "react";
import {toast, Toaster} from "sonner";
import {Input} from "@/components/ui/input";

function AlertDeleteMultipleDbTable(props) {
    const {setDatabases, open, onOpenChange, count, ids} = props
    const [dbNameDelete, setDbNameDelete] = useState("")
    const fetchDatabases = () => {
        axios.get(`/api/database`)
            .then((res) => {
                //setDataSearch(res.data)
                const c = res.data
                setDatabases({...res.data, count: c.results.length})
            })
    }
    const deleteDb = (e) => {
        ids.forEach(function (id) {
            axios.get(`/api/database/delete?id=${id}`)
                .then(() => {
                    fetchDatabases()
                    toast.success("Databases deleted successfully.")
                }).catch(() => {
                toast.error("Something goes wrong.")
            })
        })
        fetchDatabases()
        onOpenChange(!open)
    }
    return <>
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure to delete {count} database(s)?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="grid gap-3">
                            <div>
                                This action cannot be undone. This will permanently delete your database connection from our
                                servers.
                            </div>
                            <div>
                                <Input
                                    value={dbNameDelete}
                                    onChange={(e) => setDbNameDelete(e.target.value)}
                                    placeHolder={`Type "delete all"`}
                                />
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button disabled={dbNameDelete !== "delete all"} variant="destructive" onClick={() => deleteDb()}>Continue</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <Toaster position="bottom-left"/>
    </>
}

const mapStateToProps = state => {
    return {
        databases: state.databases,
        database: state.database,
        plan: state.plan
    }
}

const mapDispatchToProps = {
    setDatabases,
    setDatabase
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertDeleteMultipleDbTable)
