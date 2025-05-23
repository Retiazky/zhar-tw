import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@rn-primitives/tabs';
import * as React from 'react';

const Tabs = TabsPrimitive.Root;

function TabsList({
  className,
  ...props
}: TabsPrimitive.ListProps & {
  ref?: React.RefObject<TabsPrimitive.ListRef>;
}) {
  return (
    <TabsPrimitive.List
      className={cn(
        'web:inline-flex h-10 native:h-8 items-start bg-transparent border-b-[2px] border-secondary',
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: TabsPrimitive.TriggerProps & {
  ref?: React.RefObject<TabsPrimitive.TriggerRef>;
}) {
  const { value } = TabsPrimitive.useRootContext();
  const isActive = props.value === value;

  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm native:text-base font-medium text-muted-foreground',
        props.value === value && 'text-foreground',
        className,
      )}>
      <TabsPrimitive.Trigger
        className={cn('items-start justify-start', 'bg-transparent', 'relative', className)}
        {...props}>
        <Text
          className={cn(
            'text-sm native:text-base font-medium',
            isActive ? 'text-foreground' : 'text-muted-foreground',
            isActive && 'border-b-2 border-primary pb-0.5',
          )}>
          {props.children as React.ReactNode}
        </Text>
      </TabsPrimitive.Trigger>
    </TextClassContext.Provider>
  );
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.ContentProps & {
  ref?: React.RefObject<TabsPrimitive.ContentRef>;
}) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
