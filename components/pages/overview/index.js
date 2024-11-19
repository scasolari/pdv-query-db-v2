import LayoutTopBar from "@/components/layout/layoutTopBar";

export default function PageOverview({id, title}) {
    return <LayoutTopBar title={title}>
        <div>Overview for Workspace: {id}</div>
    </LayoutTopBar>
}
