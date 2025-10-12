<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ShieldXIcon from '@lucide/svelte/icons/shield-x';
	import HomeIcon from '@lucide/svelte/icons/home';
</script>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header class="text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
				<ShieldXIcon class="h-8 w-8 text-destructive" />
			</div>
			<Card.Title class="text-2xl">Access Denied</Card.Title>
			<Card.Description>
				{#if $page.status === 403}
					You don't have permission to access this page. Please contact Asisten if you believe this is an error.
				{:else if $page.status === 404}
					The page you're looking for doesn't exist.
				{:else}
					An error occurred: {$page.error?.message || 'Unknown error'}
				{/if}
			</Card.Description>
		</Card.Header>
		<Card.Content class="text-center">
			<Button href="/dashboard" class="w-full mt-4">
				<HomeIcon class="mr-2 h-4 w-4" />
				Back to Dashboard
			</Button>
		</Card.Content>
	</Card.Root>
</div>