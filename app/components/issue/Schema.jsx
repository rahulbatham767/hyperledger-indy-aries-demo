import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const Schema = () => {
  return (
    <div>
      <div className="text-center">
        <Form>
          <h3 className="text-xl font-bold"> Create Schema</h3>
          <FormItem>
            <FormLabel>Name of Schema:</FormLabel>
            <FormControl>
              <Input placeholder="Enter schema name" />
            </FormControl>
          </FormItem>
          <br />
          <FormItem>
            <FormLabel>Schema Version:</FormLabel>
            <FormControl>
              <Input placeholder="enter schema version " />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>Please supply a json array of attributes:</FormLabel>
            <FormControl>
              <Textarea placeholder={`["name","degree","status"]`} />
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

export default Schema;
