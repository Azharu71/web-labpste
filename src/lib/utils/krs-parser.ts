// Interface for global pdfjsLib
declare global {
    interface Window {
        pdfjsLib: any;
    }
}

// Check if loaded
const getPdfLib = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lib = (window as any).pdfjsLib;
    if (!lib) {
        throw new Error('PDF.js library not loaded from CDN');
    }
    // Ensure worker is set (redundant check)
    if (!lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }
    return lib;
};


const SHIFTS = [
	{ id: 'S1', name: 'SHIFT 1', start: '08:00', end: '10:00' },
	{ id: 'S2', name: 'SHIFT 2', start: '10:00', end: '12:00' },
	{ id: 'S3', name: 'SHIFT 3', start: '13:00', end: "15:00" }, // Note: 12-13 is break
	{ id: 'S4', name: 'SHIFT 4', start: '15:00', end: '17:00' },
	{ id: 'S5', name: 'SHIFT 5', start: '17:00', end: '19:00' }
];

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

interface ClassSchedule {
	day: string;
	start: number;
	end: number;
}

export interface AvailableSession {
	day: string;
	sessionId: number; // 1-5 corresponding to S1-S5
}

function timeToMinutes(timeStr: string): number {
	const [hours, minutes] = timeStr.replace('.', ':').split(':').map(Number);
	return hours * 60 + minutes;
}

export async function parseKrs(file: File): Promise<AvailableSession[]> {
	try {
        const pdfjsLib = getPdfLib();
        const arrayBuffer = await file.arrayBuffer();
        
        // Load PDF
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + ' ';
        }

        // Regex parsing (Matches Day ... 00:00 - 00:00)
        // Improved regex:
        // - Handles spaces in time (08 : 00)
        // - Handles different dash types (- – —)
        const dayPattern =
            /(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu)\s+[^\d]*?(\d{1,2}\s*[:.]\s*\d{2})\s*[-–—]\s*(\d{1,2}\s*[:.]\s*\d{2})/gi;
        
        const classes: ClassSchedule[] = [];
        let match;

        while ((match = dayPattern.exec(fullText)) !== null) {
            classes.push({
                day: match[1],
                start: timeToMinutes(match[2]),
                end: timeToMinutes(match[3])
            });
        }
        const availableSessions: AvailableSession[] = [];

        DAYS.forEach((dayName) => {
            // Get classes for this day
            const todaysClasses = classes.filter(
                (c) => c.day.toLowerCase() === dayName.toLowerCase()
            );

            SHIFTS.forEach((shift, index) => {
                const shiftStart = timeToMinutes(shift.start);
                const shiftEnd = timeToMinutes(shift.end);

                // Check Conflict
                // Special Rule: Saturday (Sabtu) is always available (no regular classes)
                const isConflict = dayName.toLowerCase() === 'sabtu' 
                    ? false 
                    : todaysClasses.some((cls) => {
                        // Logic: Class overlaps with Shift
                        // (Class Start < Shift End) AND (Class End > Shift Start)
                        return cls.start < shiftEnd && cls.end > shiftStart;
                    });

                // If NO conflict, it is available
                if (!isConflict) {
                    availableSessions.push({
                        day: dayName,
                        sessionId: index + 1
                    });
                }
            });
        });

        return availableSessions;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Gagal membaca file PDF. Pastikan file valid.');
    }
}
