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

function AlertDeleteDbTable(props) {
    const {dataBaseInfo, setDatabases, open, onOpenChange} = props
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
        axios.get(`/api/database/delete?id=${e}`)
            .then(() => {
                fetchDatabases()
                toast.success("Databases deleted successfully.")
            }).catch(() => {
            toast.error("Something goes wrong.")
        })
    }
    return <>
        <Toaster position="bottom-left"/>
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure to delete &quot;{dataBaseInfo.name}&quot;?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="grid gap-3">
                            <div>
                                This action cannot be undone. This will permanently delete your database connection from
                                our servers.
                            </div>
                            <div>
                                <Input
                                    value={dbNameDelete}
                                    onChange={(e) => setDbNameDelete(e.target.value)}
                                    placeHolder={`Type "${dataBaseInfo.name}"`}
                                />
                            </div>
                        </div>
                    </AlertDialogDescription>

                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button disabled={dbNameDelete !== dataBaseInfo.name} variant="destructive" onClick={() => deleteDb(dataBaseInfo.id)}>Continue</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
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

export default connect(mapStateToProps, mapDispatchToProps)(AlertDeleteDbTable)
