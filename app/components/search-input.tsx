
"use client"
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'hooks/use-debounce';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import queryString from 'query-string';
const SearchInput = () => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value); // Removed unnecessary parentheses
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="absolute flex ">
      <Search className="h-4 w-4 absolute top-3 text-slate-600" />
      <Input
        onChange={(e) => setValue(e.target.value)} // Fixed typo here
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course"
      />
    </div>
  );
};

export default SearchInput;
