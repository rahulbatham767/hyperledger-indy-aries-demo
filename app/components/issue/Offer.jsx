import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
const Offer = () => {
  return (
    <div>
      {" "}
      <div>
        <div className="text-center">
          <Form>
            <h3 className="text-xl font-bold"> Send Credential Offer</h3>
            <FormItem>
              <FormLabel>Relationship:</FormLabel>
              <FormControl>
                <Input placeholder="Enter schema name" />
              </FormControl>
            </FormItem>
            <br />
            <FormItem>
              <FormLabel>Select a Credential Offer:</FormLabel>
              <Select>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Credential Defination" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1.1">1.1</SelectItem>
                  <SelectItem value="2.10">2.10</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <FormLabel>Tag:</FormLabel>
              <FormControl>
                <Input placeholder={`Enter tag`} />
              </FormControl>
            </FormItem>

            <div className="p-4">
              <Button variant="ghost" className="bg-slate-300" size="lg">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Offer;
