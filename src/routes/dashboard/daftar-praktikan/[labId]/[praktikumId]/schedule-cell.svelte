<script lang="ts">
	interface Props {
		schedule: string[] | string | null;
	}

	let { schedule }: Props = $props();

	function parseSchedule(scheduleDiff: string[] | string | null) {
		if (!scheduleDiff) return null;

		let scheduleArray: string[] = [];
		if (typeof scheduleDiff === 'string') {
			try {
				scheduleArray = JSON.parse(scheduleDiff);
			} catch {
				return null;
			}
		} else if (Array.isArray(scheduleDiff)) {
			scheduleArray = scheduleDiff;
		}

		if (!Array.isArray(scheduleArray) || scheduleArray.length === 0) return null;

		const grouped: Record<string, string[]> = {};
		const dayOrder = { Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6, Minggu: 7 };

		scheduleArray.forEach((item) => {
			const [day, session] = item.split('_');
			if (day && session) {
				if (!grouped[day]) grouped[day] = [];
				grouped[day].push(session);
			}
		});

		const sortedDays = Object.keys(grouped).sort(
			(a, b) =>
				(dayOrder[a as keyof typeof dayOrder] || 99) - (dayOrder[b as keyof typeof dayOrder] || 99)
		);

		return sortedDays.map((day) => {
			const sessions = grouped[day].sort((a, b) => parseInt(a) - parseInt(b));
			return { day, sessions };
		});
	}

	let parsedSchedule = $derived(parseSchedule(schedule));
</script>

{#if !parsedSchedule}
	<span>-</span>
{:else}
	<ul class="list-none p-0 m-0 text-xs">
		{#each parsedSchedule as item}
			<li class="whitespace-nowrap">
				<span class="font-medium">{item.day}:</span> Shift {item.sessions.join(', ')}
			</li>
		{/each}
	</ul>
{/if}
