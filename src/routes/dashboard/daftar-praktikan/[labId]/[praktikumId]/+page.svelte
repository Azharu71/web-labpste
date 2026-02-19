<script lang="ts">
	import { page } from '$app/stores';
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Button } from '$lib/components/ui/button';
	import DataTable from './data-table.svelte';
	import { columns } from './columns';
	import type { PageData } from './$types';
	import FileSpreadsheet from '@lucide/svelte/icons/file-spreadsheet';

	let { data }: { data: PageData } = $props();
	let interns = $derived(data.interns);

	function formatScheduleForExport(jadwal: any) {
		if (!jadwal) return '-';
		// Helper to parse JSON string array
		const parse = (jsonVal: string | null) => {
			if (!jsonVal) return '';
			try {
				const arr = JSON.parse(jsonVal);
				return Array.isArray(arr) ? arr.join(', ') : '';
			} catch {
				return '';
			}
		};

		// If we want a summary string
		const parts = [];
		if (jadwal.senin) parts.push(`Senin: ${parse(jadwal.senin)}`);
		if (jadwal.selasa) parts.push(`Selasa: ${parse(jadwal.selasa)}`);
		if (jadwal.rabu) parts.push(`Rabu: ${parse(jadwal.rabu)}`);
		if (jadwal.kamis) parts.push(`Kamis: ${parse(jadwal.kamis)}`);
		if (jadwal.jumat) parts.push(`Jumat: ${parse(jadwal.jumat)}`);
		if (jadwal.sabtu) parts.push(`Sabtu: ${parse(jadwal.sabtu)}`);

		return parts.join('\n') || '-';
	}

	function getDaySchedule(jadwal: any, day: string) {
		if (!jadwal || !jadwal[day]) return '-';
		try {
			const arr = JSON.parse(jadwal[day]);
			return Array.isArray(arr) ? arr.join(', ') : '-';
		} catch {
			return '-';
		}
	}

	async function handleExport() {
		try {
			const ExcelJS = await import('exceljs');
			const { saveAs } = await import('file-saver');

			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet('Daftar Praktikan');

			// Define columns (keys only, no headers here to avoid default single row)
			worksheet.columns = [
				{ key: 'praktikum', width: 30 },
				{ key: 'full_name', width: 30 },
				{ key: 'nim', width: 15 },
				{ key: 'ipk', width: 10 },
				{ key: 'krs_type', width: 15 },
				{ key: 'krs_url', width: 30 },
				{ key: 'senin', width: 15 },
				{ key: 'selasa', width: 15 },
				{ key: 'rabu', width: 15 },
				{ key: 'kamis', width: 15 },
				{ key: 'jumat', width: 15 },
				{ key: 'sabtu', width: 15 },
				{ key: 'created_at', width: 20 }
			];

			// --- Row 1 & 2: Headers ---
			// Set Row 1 texts
			const row1 = worksheet.getRow(1);
			row1.values = [
				'Praktikum',
				'Nama Lengkap',
				'NIM',
				'IPK',
				'Tipe KRS',
				'URL KRS',
				'Jadwal Kosong (shift)',
				'',
				'',
				'',
				'',
				'', // Jadwal Kosong takes G1..L1
				'Tanggal Daftar'
			];

			// Set Row 2 texts (Sub-headers)
			const row2 = worksheet.getRow(2);
			row2.getCell('G').value = 'Senin';
			row2.getCell('H').value = 'Selasa';
			row2.getCell('I').value = 'Rabu';
			row2.getCell('J').value = 'Kamis';
			row2.getCell('K').value = 'Jumat';
			row2.getCell('L').value = 'Sabtu';

			// Merges
			worksheet.mergeCells('A1:A2'); // Praktikum
			worksheet.mergeCells('B1:B2'); // Nama
			worksheet.mergeCells('C1:C2'); // NIM
			worksheet.mergeCells('D1:D2'); // IPK
			worksheet.mergeCells('E1:E2'); // Tipe KRS
			worksheet.mergeCells('F1:F2'); // URL KRS
			worksheet.mergeCells('G1:L1'); // Jadwal Kosong (Main Header)
			worksheet.mergeCells('M1:M2'); // Tanggal Daftar

			// Style headers (Center alignment, Bold, Borders)
			[1, 2].forEach((r) => {
				const row = worksheet.getRow(r);
				row.font = { bold: true };
				row.alignment = { vertical: 'middle', horizontal: 'center' };
				row.eachCell((cell) => {
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
				});
			});

			// Add Data Rows (starting from Row 3 implied by worksheet.addRow)
			interns.forEach((intern: any) => {
				worksheet.addRow({
					praktikum: data.praktikumName,
					full_name: intern.full_name,
					nim: intern.nim,
					ipk: intern.ipk,
					krs_type: intern.krs_type,
					krs_url: intern.krs_url,
					senin: getDaySchedule(intern.jadwal_kosong, 'senin'),
					selasa: getDaySchedule(intern.jadwal_kosong, 'selasa'),
					rabu: getDaySchedule(intern.jadwal_kosong, 'rabu'),
					kamis: getDaySchedule(intern.jadwal_kosong, 'kamis'),
					jumat: getDaySchedule(intern.jadwal_kosong, 'jumat'),
					sabtu: getDaySchedule(intern.jadwal_kosong, 'sabtu'),
					created_at: new Date(intern.created_at).toLocaleString('id-ID')
				});
			});

			// Enable wrap text for schedule columns
			['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'].forEach((key) => {
				worksheet.getColumn(key).alignment = {
					wrapText: true,
					vertical: 'middle',
					horizontal: 'center'
				};
			});

			// Generate buffer
			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			});

			saveAs(blob, `Daftar_Praktikan_${data.praktikumName.replace(/ /g, '_')}.xlsx`);
		} catch (e) {
			console.error('Export failed:', e);
			alert('Gagal mengekspor data. ' + e);
		}
	}
</script>

<Sidebar.Provider>
	<AppSidebar userData={data.userData} />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator
				orientation="vertical"
				class="mr-2 hidden md:block data-[orientation=vertical]:h-4"
			/>
			<Breadcrumb.Root class="hidden md:block">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/dashboard/daftar-praktikan">Daftar Praktikan</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/dashboard/daftar-praktikan/{data.labId}">
							{data.labName}
						</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>{data.praktikumName}</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>

		<div class="flex flex-1 flex-col gap-6 p-6 pt-0">
			<div class="flex items-center justify-between">
				<div class="flex flex-col gap-1">
					<h2 class="text-3xl font-bold tracking-tight">{data.praktikumName}</h2>
					<p class="text-muted-foreground">Daftar praktikan yang terdaftar.</p>
				</div>
				<Button onclick={handleExport}>
					<FileSpreadsheet class="mr-2 h-4 w-4" />
					Export Excel
				</Button>
			</div>

			<DataTable data={interns} {columns} />
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
