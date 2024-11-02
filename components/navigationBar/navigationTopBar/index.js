import { TbBrandPlanetscale } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {BiCheck, BiExpandVertical, BiPlus} from "react-icons/bi";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import { LuExternalLink } from "react-icons/lu";
import {setDatabases, setOrganization, setOrganizations, setProfile} from "@/redux/actions/main";
import {connect} from "react-redux";
import OrganizationAvatar from "@/components/organizationAvatar";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import OrganizationAdd from "@/pages/app/organization/add";
import {BsCheck} from "react-icons/bs";
import {BookOpen, Database, History, Settings} from "lucide-react";


function NavigationTopBar(props) {
    const { profile, setProfile, setOrganizations, organizations, setOrganization, organization, setDatabases } = props;
    const router = useRouter();
    const { id } = router.query;

    const linkActive = (path) => {
        return router.asPath === path;
    };

    console.log(organization?.name)
    console.log(router.asPath)

    return <>
        <div
            className="sticky top-0 py-4 pb-0 mb-4 sm:border-none border-b border-gray-100 dark:border-gray-100/10 bg-white bg-opacity-0 backdrop-blur-lg">
            <div className="flex items-center w-full justify-between px-6">
                <div className="flex items-center gap-3">
                    <div>
                        <Link href="/app/welcome" onClick={() => setOrganization(null)}>
                            <TbBrandPlanetscale size={28}/>
                        </Link>
                    </div>
                    <div className="mr-3">
                        <Popover>
                            <PopoverTrigger>
                                <Button
                                    className="border"
                                    variant="secondary">
                                    <div className="flex items-center gap-2">
                                        {organization?.name === undefined
                                            ? <OrganizationAvatar size={24} profile={profile?.user?.name}/>
                                            : <OrganizationAvatar profile={organization?.name}/>
                                        }
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="truncate">{organization?.name || profile?.user?.name}</span>
                                            <Badge
                                                className="rounded-full !bg-gray-200 !text-black shadow-none">Free</Badge>
                                        </div>
                                    </div>
                                    <BiExpandVertical/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 mt-1" side="bottom" align="start">
                                <div
                                    className="flex items-center justify-between m-2 p-2 hover:bg-gray-100 hover:cursor-pointer rounded-md dark:hover:bg-gray-100/10">
                                    <Link onClick={() => setOrganization(null)} href="/app/overview"
                                          className="flex items-center gap-2">
                                        <OrganizationAvatar size={20} profile={profile?.user?.name}/>
                                        <div className="flex items-center gap-2">
                                            <span className="font-[600]">{profile?.user?.name}</span>
                                            <Badge
                                                className="rounded-full !bg-gray-200 !text-black shadow-none">Free</Badge>
                                        </div>
                                    </Link>
                                    {id === undefined ? <BiCheck size={18}/> : null}
                                </div>
                                <Separator/>
                                <div className="flex items-center justify-between m-2 p-2">
                                    <div className="text-gray-500 dark:text-muted-foreground">Workspaces</div>
                                    <Dialog>
                                        <DialogTrigger>
                                            <BiPlus
                                                className="transition duration-0 hover:duration-150 text-gray-500 dark:text-muted-foreground hover:text-black hover:cursor-pointer hover:dark:text-white"
                                                size={18}/>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <OrganizationAdd/>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div
                                    className={`max-h-[240px] overflow-y-scroll ${organizations?.organizations?.length === 0 ? null : `py-2 pt-0`}`}>
                                    {organizations?.organizations?.map((d, i) => {
                                        return <Link onClick={() => setOrganization({
                                            id: d.id,
                                            name: d.name,
                                            organizationOwner: d.email,
                                        })} href={`/app/${d.id}/overview`} key={i}
                                                     className={`flex items-center justify-between my-0 mx-2 p-2 hover:bg-gray-100/60 rounded-md hover:cursor-pointer dark:hover:bg-gray-100/10 ${router.asPath === `/app/${d.id}/overview` ? `bg-gray-100 dark:bg-gray-100/10` : null}`}>
                                            <div className="flex items-center gap-2">
                                                <OrganizationAvatar profile={d.name} size={20}/>
                                                <div className="text-gray-500 dark:text-muted-foreground">
                                                    {d.name}
                                                </div>
                                            </div>
                                            {id === d.id ? <BsCheck size={18}/> : null}
                                        </Link>
                                    })}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center">
                        <Popover>
                            <PopoverTrigger>
                                <OrganizationAvatar size={36} profile={profile?.user?.name}/>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 mt-1" side="bottom" align="end">
                                <div className="py-5 flex-col items-center">
                                    <div className="flex flex-col items-center content-center gap-3 w-full">
                                        <OrganizationAvatar size={88} profile={profile?.user?.name}/>
                                        <div className="flex justify-center items-center gap-3">
                                            <h2 className="text-lg font-semibold">
                                                {profile?.user?.name}
                                            </h2>
                                            <Badge
                                                className="rounded-full !bg-gray-200 !text-black shadow-none">Free</Badge>
                                        </div>
                                        <div className="flex items-center justify-center gap-3 w-full">
                                            <Button
                                                className="bg-white border-2 border-green-600 rounded-full text-green-600 shadow-none hover:bg-green-600 hover:text-white font-semibold dark:bg-transparent dark:hover:bg-green-600">
                                                Subscribe to Pro (€2.99/m)
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-1">
                                    <ul className="p-2">
                                        <li className="rounded-md px-3 flex items-center justify-between hover:bg-gray-100/60 dark:hover:bg-gray-100/10">
                                            <Link href="/app/databases"
                                                  className="py-2 hover:text-black dark:hover:text-white w-full">
                                                Databases
                                            </Link>
                                            <Link href="/app/databases/add"
                                                  className="py-2 text-gray-500 dark:text-muted-foreground hover:text-black dark:hover:text-white">
                                                <BiPlus size={18}/>
                                            </Link>
                                        </li>
                                        <li className="rounded-md px-3 flex items-center justify-between hover:bg-gray-100/60 dark:hover:bg-gray-100/10">
                                            <Link href="/app/backups"
                                                  className="py-2 hover:text-black dark:hover:text-white w-full">
                                                Backups
                                            </Link>
                                            <Link href="/app/backups/add"
                                                  className="py-2 text-gray-500 dark:text-muted-foreground hover:text-black dark:hover:text-white">
                                                <BiPlus size={18}/>
                                            </Link>
                                        </li>
                                        <li className="rounded-md px-3 flex items-center justify-between hover:bg-gray-100/60 dark:hover:bg-gray-100/10">
                                            <Link href="/app/feedback"
                                                  className="py-2 hover:text-black dark:hover:text-white w-full">
                                                Feedback
                                            </Link>
                                            <LuExternalLink size={18}/>
                                        </li>
                                        <li className="rounded-md px-3 flex items-center justify-between hover:bg-gray-100/60 dark:hover:bg-gray-100/10">
                                            <Link href="/app/docs"
                                                  className="py-2 hover:text-black dark:hover:text-white w-full">
                                                Docs
                                            </Link>
                                            <LuExternalLink size={18}/>
                                        </li>
                                        <li className="rounded-md px-3 flex items-center justify-between hover:bg-gray-100/60 dark:hover:bg-gray-100/10">
                                            <div
                                                className="py-2 hover:text-black dark:hover:text-white w-full hover:cursor-pointer"
                                                onClick={() => {
                                                    setProfile(null)
                                                    setOrganization(null)
                                                    setOrganizations([])
                                                    setDatabases([])
                                                    sessionStorage.removeItem("persist:root")
                                                    signOut({callbackUrl: "/"})
                                                        .then(() => {
                                                        })
                                                }}>
                                                Sign out
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
            <div
                className="hidden sm:block px-6 pb-2 border-b mt-5">
                <ul className="h6 flex items-center gap-2">
                    <li>
                        <Link
                            className={`relative flex items-center gap-2 text-gray-500 dark:text-muted-foreground h6 px-2 py-1 hover:text-black rounded-md font-semibold hover:bg-gray-100 dark:hover:bg-gray-100/10 ${linkActive(router.asPath === `/app/${id}/overview` ? `/app/${id}/overview` : "/app/overview") ? `!text-black dark:!text-white` : ``}`}
                            href={`/app/${id === undefined ? `` : id + `/`}overview`}>
                            <BookOpen size={18}/>
                            Overview
                            {linkActive(router.asPath === `/app/${id}/overview` ? `/app/${id}/overview` : "/app/overview")
                                ? <div className="h-[2px] w-full bg-black dark:bg-white absolute bottom-[-9px] left-0"/>
                                : null
                            }
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`relative flex items-center gap-2 text-gray-500 dark:text-muted-foreground h6 px-2 py-1 hover:text-black rounded-md font-semibold hover:bg-gray-100 dark:hover:bg-gray-100/10 ${linkActive(router.asPath === `/app/${id}/databases` ? `/app/${id}/databases` : "/app/databases") ? `!text-black dark:!text-white` : ``}`}
                            href={`/app/${id === undefined ? `` : id + `/`}databases`}>
                            <Database size={18}/>
                            Databases
                            {linkActive(router.asPath === `/app/${id}/databases` ? `/app/${id}/databases` : "/app/databases")
                                ? <div className="h-[2px] w-full bg-black dark:bg-white absolute bottom-[-9px] left-0"/>
                                : null
                            }
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`relative flex items-center gap-2 text-gray-500 dark:text-muted-foreground h6 px-2 py-1 hover:text-black rounded-md font-semibold hover:bg-gray-100 dark:hover:bg-gray-100/10 ${linkActive(router.asPath === `/app/${id}/backups` ? `/app/${id}/backups` : "/app/backups") ? `!text-black dark:!text-white` : ``}`}
                            href={`/app/${id === undefined ? `` : id + `/`}backups`}>
                            <History size={18}/>
                            Backups
                            {linkActive(router.asPath === `/app/${id}/backups` ? `/app/${id}/backups` : "/app/backups")
                                ? <div className="h-[2px] w-full bg-black dark:bg-white absolute bottom-[-9px] left-0"/>
                                : null
                            }
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`relative flex items-center gap-2 text-gray-500 dark:text-muted-foreground h6 px-2 py-1 hover:text-black rounded-md font-semibold hover:bg-gray-100 dark:hover:bg-gray-100/10 ${linkActive(router.asPath === `/app/${id}/settings` ? `/app/${id}/settings` : "/app/settings") ? `!text-black dark:!text-white` : ``}`}
                            href={`/app/${id === undefined ? `` : id + `/`}settings`}>
                            <Settings size={18}/>
                            Settings
                            {linkActive(router.asPath === `/app/${id}/settings` ? `/app/${id}/settings` : "/app/settings")
                                ? <div className="h-[2px] w-full bg-black dark:bg-white absolute bottom-[-9px] left-0"/>
                                : null
                            }
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </>
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile.profile,
        organizations: state.organizations,
        organization: state.organization.organization
    };
};

const mapDispatchToProps = {
    setProfile,
    setOrganizations,
    setOrganization,
    setDatabases,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationTopBar);
