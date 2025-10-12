import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table";
import DataTableActions from "./data-table-actions.svelte";
import { Checkbox } from "$lib/components/ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type NilaiPraktikum = {
    id: number;
    praktikum_id: string | null;
    nim: string;
    nama: string;
    praktikum_u1: number | null;
    laporan_u1: number | null;
    total_nilai_u1: number | null;
    praktikum_u2: number | null;
    laporan_u2: number | null;
    total_nilai_u2: number | null;
    praktikum_u3: number | null;
    laporan_u3: number | null;
    total_nilai_u3: number | null;
    praktikum_u4: number | null;
    laporan_u4: number | null;
    total_nilai_u4: number | null;
    praktikum_u5: number | null;
    laporan_u5: number | null;
    total_nilai_u5: number | null;
    praktikum_u6: number | null;
    laporan_u6: number | null;
    total_nilai_u6: number | null;
    praktikum_u7: number | null;
    laporan_u7: number | null;
    total_nilai_u7: number | null;
    praktikum_u8: number | null;
    laporan_u8: number | null;
    total_nilai_u8: number | null;
    sosialisasi: number | null;
    responsi: number | null;
    absolut: number | null;
    grade: string | null;
};

export const columns: ColumnDef<NilaiPraktikum>[] = [
    {
        id: "select",
        header: ({ table }) =>
            renderComponent(Checkbox, {
                checked: table.getIsAllPageRowsSelected(),
                indeterminate:
                    table.getIsSomePageRowsSelected() &&
                    !table.getIsAllPageRowsSelected(),
                onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
                "aria-label": "Select all",
            }),
        cell: ({ row }) =>
            renderComponent(Checkbox, {
                checked: row.getIsSelected(),
                onCheckedChange: (value) => row.toggleSelected(!!value),
                "aria-label": "Select row",
            }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "nim",
        header: "NIM",
        meta: {
            className: "text-center"
        }
    },
    {
        accessorKey: "nama",
        header: "Nama Mahasiswa",
        meta: {
            className: "text-left"
        }
    },
    {
        accessorKey: "praktikum_id",
        header: "Kode Praktikum",
        cell: ({ row }) => {
            return row.original.praktikum_id?.toUpperCase() || "-";
        },
        meta: {
            className: "text-center"
        }
    },
    {
        header: "UNIT 1",
        meta: {
            className: "text-center font-semibold bg-gray-50"
        },
        columns: [
            {
                accessorKey: "praktikum_u1",
                header: "Praktikum",
                cell: ({ row }) => {
                    return row.original.praktikum_u1?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "laporan_u1",
                header: "Laporan",
                cell: ({ row }) => {
                    return row.original.laporan_u1?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "total_nilai_u1",
                header: "Total",
                cell: ({ row }) => {
                    return row.original.total_nilai_u1?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center font-bold"
                }
            },
        ],
    },
    {
        header: "UNIT 2",
        meta: {
            className: "text-center font-semibold bg-gray-50"
        },
        columns: [
            {
                accessorKey: "praktikum_u2",
                header: "Praktikum",
                cell: ({ row }) => {
                    return row.original.praktikum_u2?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "laporan_u2",
                header: "Laporan",
                cell: ({ row }) => {
                    return row.original.laporan_u2?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "total_nilai_u2",
                header: "Total",
                cell: ({ row }) => {
                    return row.original.total_nilai_u2?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center font-bold"
                }
            },
        ],
    },
    {
        header: "UNIT 3",
        meta: {
            className: "text-center font-semibold bg-gray-50"
        },
        columns: [
            {
                accessorKey: "praktikum_u3",
                header: "Praktikum",
                cell: ({ row }) => {
                    return row.original.praktikum_u3?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "laporan_u3",
                header: "Laporan",
                cell: ({ row }) => {
                    return row.original.laporan_u3?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "total_nilai_u3",
                header: "Total",
                cell: ({ row }) => {
                    return row.original.total_nilai_u3?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center font-bold"
                }
            },
        ],
    },
    {
        header: "UNIT 4",
        meta: {
            className: "text-center font-semibold bg-gray-50"
        },
        columns: [
            {
                accessorKey: "praktikum_u4",
                header: "Praktikum",
                cell: ({ row }) => {
                    return row.original.praktikum_u4?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "laporan_u4",
                header: "Laporan",
                cell: ({ row }) => {
                    return row.original.laporan_u4?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "total_nilai_u4",
                header: "Total",
                cell: ({ row }) => {
                    return row.original.total_nilai_u4?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center font-bold"
                }
            },
        ],
    },
    {
        header: "UNIT 5",
        meta: {
            className: "text-center font-semibold bg-gray-50"
        },
        columns: [
            {
                accessorKey: "praktikum_u5",
                header: "Praktikum",
                cell: ({ row }) => {
                    return row.original.praktikum_u5?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "laporan_u5",
                header: "Laporan",
                cell: ({ row }) => {
                    return row.original.laporan_u5?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "total_nilai_u5",
                header: "Total",
                cell: ({ row }) => {
                    return row.original.total_nilai_u5?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center font-bold"
                }
            },
        ],
    },
    {
        header: "UNIT 6",
        meta: {
            className: "text-center font-semibold bg-gray-50"
        },
        columns: [
            {
                accessorKey: "praktikum_u6",
                header: "Praktikum",
                cell: ({ row }) => {
                    return row.original.praktikum_u6?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "laporan_u6",
                header: "Laporan",
                cell: ({ row }) => {
                    return row.original.laporan_u6?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "total_nilai_u6",
                header: "Total",
                cell: ({ row }) => {
                    return row.original.total_nilai_u6?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center font-bold"
                }
            },
        ],
    },
    {
        header: "UNIT 7",
        meta: {
            className: "text-center font-semibold bg-gray-50"
        },
        columns: [
            {
                accessorKey: "praktikum_u7",
                header: "Praktikum",
                cell: ({ row }) => {
                    return row.original.praktikum_u7?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "laporan_u7",
                header: "Laporan",
                cell: ({ row }) => {
                    return row.original.laporan_u7?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "total_nilai_u7",
                header: "Total",
                cell: ({ row }) => {
                    return row.original.total_nilai_u7?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center font-bold"
                }
            },
        ],
    },
    {
        header: "UNIT 8",
        meta: {
            className: "text-center font-semibold bg-gray-50"
        },
        columns: [
            {
                accessorKey: "praktikum_u8",
                header: "Praktikum",
                cell: ({ row }) => {
                    return row.original.praktikum_u8?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "laporan_u8",
                header: "Laporan",
                cell: ({ row }) => {
                    return row.original.laporan_u8?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center"
                }
            },
            {
                accessorKey: "total_nilai_u8",
                header: "Total",
                cell: ({ row }) => {
                    return row.original.total_nilai_u8?.toFixed(2) || "-";
                },
                meta: {
                    className: "text-center font-bold"
                }
            },
        ],
    },
    {
        accessorKey: "sosialisasi",
        header: "Sosialisasi",
        cell: ({ row }) => {
            return row.original.sosialisasi?.toFixed(2) || "-";
        },
        meta: {
            className: "text-center"
        }
    },
    {
        accessorKey: "responsi",
        header: "Responsi",
        cell: ({ row }) => {
            return row.original.responsi?.toFixed(2) || "-";
        },
        meta: {
            className: "text-center"
        }
    },
    {
        accessorKey: "absolut",
        header: "Absolut",
        cell: ({ row }) => {
            return row.original.absolut?.toFixed(2) || "-";
        },
        meta: {
            className: "text-center font-medium"
        }
    },
    {
        accessorKey: "grade",
        header: "Grade",
        cell: ({ row }) => {
            const grade = row.original.grade;
            if (!grade) return "-";
            return grade;
        },
        meta: {
            className: "text-center font-bold"
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            // You can pass whatever you need from `row.original` to the component
            return renderComponent(DataTableActions, { id: row.original.id.toString() });
        },
    },
];