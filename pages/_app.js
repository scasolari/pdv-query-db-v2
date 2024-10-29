import "@/styles/globals.css";
import {SessionProvider} from "next-auth/react";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {store, persistor} from "@/redux";
import {ThemeProvider} from "next-themes";
import {PostHogProvider} from 'posthog-js/react'

const options = {
    api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
}

export default function App({Component, pageProps}) {
    return <Provider store={store}>
        <SessionProvider>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider attribute="class" disableTransitionOnChange>
                    <PostHogProvider
                        apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
                        options={options}
                    >
                        <Component {...pageProps} />
                    </PostHogProvider>
                </ThemeProvider>
            </PersistGate>
        </SessionProvider>
    </Provider>;
}
