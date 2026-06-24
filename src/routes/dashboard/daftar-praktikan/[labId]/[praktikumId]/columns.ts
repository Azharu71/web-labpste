import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableColumnHeader from './data-table-column-header.svelte';
import ScheduleCell from './schedule-cell.svelte'; // Reuse sched cell for individual tasks if needed, or simple text
import KrsCell from './krs-cell.svelte';

export type Intern = {
	id: string;
	full_name: string;
	nim: string;
	ipk: string;
	krs_type: 'manual' | 'regular';
	krs_url: string | null;
	jadwal_kosong: {
		senin: string | null;
		selasa: string | null;
		rabu: string | null;
		kamis: string | null;
		jumat: string | null;
		sabtu: string | null;
		minggu: string | null;
	}[] | {
		senin: string | null;
		selasa: string | null;
		rabu: string | null;
		kamis: string | null;
		jumat: string | null;
		sabtu: string | null;
		minggu: string | null;
	} | null;
	created_at: string;
};

// Helper to format JSON string array to readable string (e.g. "Shift 1, 2")
const formatShifts = (jsonStr: string | null | undefined) => {
	if (!jsonStr) return '-';
	try {
		const parsed = JSON.parse(jsonStr);
		if (Array.isArray(parsed) && parsed.length > 0) {
			return parsed.join(', ');
		}
		return '-';
	} catch {
		return '-';
	}
};

export const columns: ColumnDef<Intern>[] = [
	{
		accessorKey: 'full_name',
		header: 'Nama',
        size: 200,
	},
	{
		accessorKey: 'nim',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				column: column as any,
				title: 'NIM'
			})
	},
	{
		accessorKey: 'ipk',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				column: column as any,
				title: 'IPK'
			})
	},
	{
		accessorKey: 'krs_type',
		header: 'Tipe KRS'
	},
	{
		accessorKey: 'krs_url',
		header: 'KRS',
		cell: ({ row }) => {
			const url = row.getValue('krs_url') as string;
			return renderComponent(KrsCell, { url });
		}
	},
    // Grouped Header for Jadwal Kosong
    {
        id: 'jadwal_kosong_group',
        header: 'Jadwal Kosong (shift)',
        columns: [
            {
                id: 'senin',
                header: 'Senin',
                accessorFn: (row) => {
                    const jk = Array.isArray(row.jadwal_kosong) ? row.jadwal_kosong[0] : row.jadwal_kosong;
                    return formatShifts(jk?.senin);
                }
            },
            {
                id: 'selasa',
                header: 'Selasa',
                accessorFn: (row) => {
                    const jk = Array.isArray(row.jadwal_kosong) ? row.jadwal_kosong[0] : row.jadwal_kosong;
                    return formatShifts(jk?.selasa);
                }
            },
            {
                id: 'rabu',
                header: 'Rabu',
                accessorFn: (row) => {
                    const jk = Array.isArray(row.jadwal_kosong) ? row.jadwal_kosong[0] : row.jadwal_kosong;
                    return formatShifts(jk?.rabu);
                }
            },
            {
                id: 'kamis',
                header: 'Kamis',
                accessorFn: (row) => {
                    const jk = Array.isArray(row.jadwal_kosong) ? row.jadwal_kosong[0] : row.jadwal_kosong;
                    return formatShifts(jk?.kamis);
                }
            },
            {
                id: 'jumat',
                header: 'Jumat',
                accessorFn: (row) => {
                    const jk = Array.isArray(row.jadwal_kosong) ? row.jadwal_kosong[0] : row.jadwal_kosong;
                    return formatShifts(jk?.jumat);
                }
            },
            {
                id: 'sabtu',
                header: 'Sabtu',
                accessorFn: (row) => {
                    const jk = Array.isArray(row.jadwal_kosong) ? row.jadwal_kosong[0] : row.jadwal_kosong;
                    return formatShifts(jk?.sabtu);
                }
            },
            {
                id: 'minggu',
                header: 'Minggu',
                accessorFn: (row) => {
                    const jk = Array.isArray(row.jadwal_kosong) ? row.jadwal_kosong[0] : row.jadwal_kosong;
                    return formatShifts(jk?.minggu);
                }
            }
        ]
    },
	{
		accessorKey: 'created_at',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				column: column as any,
				title: 'Tanggal Daftar'
			}),
		cell: ({ row }) => {
			const date = new Date(row.getValue('created_at'));
			const formatted = new Intl.DateTimeFormat('id-ID', {
				dateStyle: 'medium',
				timeStyle: 'short'
			}).format(date);
			return formatted;
		}
	}
];
