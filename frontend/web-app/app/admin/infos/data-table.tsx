"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WebInfo } from "@/types";
import Link from "next/link";

type Props = {
  infos: WebInfo[];
};
export default function DataTable({ infos }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">NUM</TableHead>
          <TableHead className="text-center">TITLE</TableHead>
          <TableHead className="text-center">METADATA</TableHead>
          <TableHead className="text-center">KEYWORD</TableHead>
          <TableHead className="text-center">PHONE NUMBER</TableHead>
          <TableHead className="text-center">EMAIL</TableHead>
          <TableHead className="text-center">URL</TableHead>
          <TableHead className="w-[100px] text-center">ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {infos.map((info, index) => (
          <TableRow key={info.id}>
            <TableCell className="text-center">{index + 1}</TableCell>
            <TableCell className="text-center">{info.title}</TableCell>
            <TableCell className="text-center">
              {info.metaDescription}
            </TableCell>
            <TableCell className="text-center">{info.keywords}</TableCell>
            <TableCell className="text-center">{info.phoneNumber}</TableCell>
            <TableCell className="text-center">{info.email}</TableCell>
            <TableCell className="text-center">{info.url}</TableCell>
            <TableCell className="flex gap-1 justify-center">
              <Button asChild variant={"outline"} size={"sm"}>
                <Link href={`/admin/infos/${info.id}`}>Edit</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
