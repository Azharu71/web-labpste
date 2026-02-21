<script lang="ts">
	import { useSidebar } from '$lib/components/ui/sidebar';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { page } from '$app/stores';

	let {
		navMain
	}: {
		navMain: {
			name: string;
			url: string;
			icon: any;
		}[];
	} = $props();
	const sidebar = useSidebar();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Navigasi</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each navMain as item (item.name)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton isActive={$page.url.pathname === item.url}>
					{#snippet child({ props })}
						<a
							href={item.url}
							{...props}
							onclick={() => {
								if (sidebar.isMobile) sidebar.setOpenMobile(false);
							}}
						>
							<item.icon />
							<span>{item.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
