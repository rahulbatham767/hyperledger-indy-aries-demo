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
import React from "react";

const Credentials = () => {
  return (
    <div>
      <div className="text-center">
        <Form>
          <h3 className="text-xl font-bold"> Create Credential Defination</h3>
          <FormItem>
            <FormLabel>Name of Schema:</FormLabel>
            <FormControl>
              <Input placeholder="Enter schema name" />
            </FormControl>
          </FormItem>
          <br />
          <FormItem>
            <FormLabel>Schema Version:</FormLabel>
            <Select>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Schema" />
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
  );
};

export default Credentials;
