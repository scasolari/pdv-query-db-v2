import NavigationBar from "@/components/navigationBar/navigationLeftBar";

export default function Layout({ children, title }) {
    return <div>
        <NavigationBar/>
        <div className="ml-[60px] flex items-center h-16 px-6">
            <span className="text-lg font-medium">{title}</span>
        </div>
        <div className="ml-[60px] px-6">
            {children}
        </div>
    </div>
}
