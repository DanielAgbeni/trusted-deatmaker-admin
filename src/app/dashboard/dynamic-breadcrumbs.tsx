"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { Fragment } from "react";

export const DynamicBreadcrumb = () => {
  const breadcrumbs = useBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem className="min-w-0">
              {item.isCurrentPage ? (
                <BreadcrumbPage className="truncate max-w-[80px] sm:max-w-[300px] text-[10px] sm:text-sm">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={item.href || "#"}
                  className="truncate max-w-[60px] sm:max-w-[200px] text-[10px] sm:text-sm"
                >
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
