<script lang="ts" generics="TData, TValue">
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import type { Column } from '@tanstack/table-core';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	type Props = {
		column: Column<TData, TValue>;
		title: string;
		class?: string;
	};

	let { column, title, class: className }: Props = $props();
</script>

{#if !column.getCanSort()}
	<div class={cn(className)}>{title}</div>
{:else}
	<div class={cn('flex items-center space-x-2', className)}>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="sm"
						class="-ml-3 h-8 data-[state=open]:bg-accent"
					>
						<span>{title}</span>
						{#if column.getIsSorted() === 'desc'}
							<ArrowDown />
						{:else if column.getIsSorted() === 'asc'}
							<ArrowUp />
						{:else}
							<ChevronsUpDown />
						{/if}
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start">
				<DropdownMenu.Item onclick={() => column.toggleSorting(false)}>
					<ArrowUp class="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
					Asc
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => column.toggleSorting(true)}>
					<ArrowDown class="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
					Desc
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
{/if}
