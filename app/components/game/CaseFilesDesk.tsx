'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CaseFileItem, { CaseFileData } from './CaseFileItem';
import CaseFileViewer, { FileContent } from './CaseFileViewer';

// Demo data - replace with actual case data from your database
const DEMO_FILES: CaseFileData[] = [
  { id: '001', label: 'WITNESS STMT', type: 'document', color: 'manila', isNew: true },
  { id: '002', label: 'CRIME PHOTOS', type: 'photo', color: 'red' },
  { id: '003', label: 'EVIDENCE #1', type: 'evidence', color: 'blue' },
  { id: '004', label: 'SUSPECT FILE', type: 'folder', color: 'manila' },
  { id: '005', label: 'LAB RESULTS', type: 'document', color: 'green', isLocked: true },
];

const DEMO_CONTENT: Record<string, FileContent> = {
  '001': {
    title: 'WITNESS STATEMENT - MRS. CHEN',
    description: 'Statement taken on the morning of the incident. Witness claims to have seen suspicious activity near the canteen around 6:45 AM.',
    documents: [
      {
        id: 'doc1',
        title: 'Official Statement',
        content: `I was walking to my shop when I noticed someone near the canteen back door. They were wearing a dark hoodie and seemed to be in a hurry. I didn't see their face clearly, but they dropped something as they ran away.

Time of observation: Approximately 6:45 AM
Location: Behind Sunrise Canteen
Weather: Clear morning`,
      },
    ],
    notes: [
      'Check CCTV footage from 6:30-7:00 AM',
      'Dark hoodie - cross-reference with lost & found',
      'What did they drop? Search the area again',
    ],
    clueRevealed: 'The suspect was at the scene around 6:45 AM - this matches the estimated time of the incident!',
  },
  '002': {
    title: 'CRIME SCENE PHOTOGRAPHS',
    description: 'Photographic evidence collected from the Sunrise Canteen on the day of the incident.',
    photos: [
      { id: 'p1', url: '', caption: 'Canteen entrance - 7:15 AM' },
      { id: 'p2', url: '', caption: 'Kitchen area overview' },
      { id: 'p3', url: '', caption: 'Storage room door' },
      { id: 'p4', url: '', caption: 'Evidence marker #3' },
      { id: 'p5', url: '', caption: 'Footprint near exit' },
      { id: 'p6', url: '', caption: 'Dropped item location' },
    ],
    clueRevealed: 'The footprint measurements suggest the suspect wears size 8 shoes.',
  },
  '003': {
    title: 'EVIDENCE ITEM #1 - TORN FABRIC',
    description: 'A piece of dark fabric found caught on the fence behind the canteen.',
    photos: [
      { id: 'e1', url: '', caption: 'Fabric sample - front' },
      { id: 'e2', url: '', caption: 'Fabric sample - closeup' },
    ],
    documents: [
      {
        id: 'analysis1',
        title: 'Preliminary Analysis',
        content: `Material: Cotton blend
Color: Dark navy blue
Possible source: Hoodie or jacket
Condition: Freshly torn (within 24 hours)`,
      },
    ],
    notes: ['Match fabric to clothing in student lockers', 'Check if any PE uniforms are missing'],
    clueRevealed: 'This fabric matches the school\'s PE department hoodies!',
  },
  '004': {
    title: 'SUSPECT PROFILE - PENDING',
    description: 'Suspect information will be compiled as investigation progresses.',
    notes: [
      'Suspect wore dark clothing',
      'Approximate shoe size: 8',
      'Familiar with canteen layout?',
      'Check alibis for 6:30-7:00 AM',
    ],
  },
};

interface CaseFilesDeskProps {
  caseId?: string;
  files?: CaseFileData[];
  fileContents?: Record<string, FileContent>;
  onFileExamined?: (fileId: string) => void;
}

export default function CaseFilesDesk({
  files = DEMO_FILES,
  fileContents = DEMO_CONTENT,
  onFileExamined,
}: CaseFilesDeskProps) {
  const [selectedFile, setSelectedFile] = useState<CaseFileData | null>(null);
  const [examinedFiles, setExaminedFiles] = useState<Set<string>>(new Set());

  const handleFileClick = (file: CaseFileData) => {
    setSelectedFile(file);
    if (!examinedFiles.has(file.id)) {
      setExaminedFiles((prev) => new Set(prev).add(file.id));
      onFileExamined?.(file.id);
    }
  };

  const handleCloseFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="relative w-full">
      {/* Desk surface */}
      <motion.div
        className="detective-desk rounded-lg p-8 min-h-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Desk lamp glow */}
        <div
          className="absolute top-0 right-8 w-64 h-64 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top right, rgba(245, 158, 11, 0.15) 0%, transparent 60%)',
          }}
        />

        {/* Header */}
        <motion.div
          className="mb-6 border-b-2 border-amber-600/30 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-amber-400 font-mono tracking-widest flex items-center gap-3">
            <span className="text-2xl">📁</span>
            CASE FILES
            <span className="text-sm text-slate-500 ml-auto">
              {examinedFiles.size} / {files.length} examined
            </span>
          </h2>
          <p className="text-slate-500 text-sm font-mono mt-1 tracking-wide">
            » Select a file to examine evidence «
          </p>
        </motion.div>

        {/* Files on desk */}
        <div className="flex flex-wrap gap-6 justify-center items-end py-8">
          {files.map((file, index) => (
            <CaseFileItem
              key={file.id}
              file={{
                ...file,
                isNew: file.isNew && !examinedFiles.has(file.id),
              }}
              index={index}
              onClick={handleFileClick}
            />
          ))}
        </div>

        {/* Coffee stain decoration */}
        <motion.div
          className="absolute bottom-8 right-12 w-16 h-16 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(120, 53, 15, 0.15) 0%, transparent 70%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
        />

        {/* Pencil decoration */}
        <motion.div
          className="absolute bottom-6 left-8 text-3xl pointer-events-none opacity-30"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 0.3 }}
          transition={{ delay: 0.8 }}
        >
          ✏️
        </motion.div>

        {/* Magnifying glass decoration */}
        <motion.div
          className="absolute top-8 left-8 text-4xl pointer-events-none opacity-20"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: 'spring' }}
        >
          🔍
        </motion.div>
      </motion.div>

      {/* File viewer modal */}
      <AnimatePresence>
        {selectedFile && fileContents[selectedFile.id] && (
          <CaseFileViewer
            file={selectedFile}
            content={fileContents[selectedFile.id]}
            onClose={handleCloseFile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
