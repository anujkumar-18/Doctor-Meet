import { TabsContent } from "@/components/ui/tabs";
import React from "react";
const Adminpage = () => {
    return (
        <div>
            <TabsContent value="pending">
                Pending Verification content goes here.
            </TabsContent>
            <TabsContent value="doctors">Manage doctors here.</TabsContent>
        </div>
    );
};

export default Adminpage;