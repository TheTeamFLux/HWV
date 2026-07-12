package com.example.backend.service;
import com.example.backend.entity.PdfFile;
import com.example.backend.repository.PdfFileRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class PdfService {

    private final PdfFileRepository pdfRepository;
    private final GeminiService geminiService;

    public PdfService(PdfFileRepository pdfRepository,
                      GeminiService geminiService) {

        this.pdfRepository = pdfRepository;
        this.geminiService = geminiService;
    }

    public PdfFile upload(MultipartFile file) throws IOException {

        String uploadDir = "uploads/";

        File dir = new File(uploadDir);

        if (!dir.exists()) {
            dir.mkdirs();
        }

        String savedName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        String path = uploadDir + savedName;

        file.transferTo(new File(path));

        PdfFile pdf = new PdfFile();

        pdf.setFilePath(path);
        pdf.setOriginalName(file.getOriginalFilename());
        pdf.setSavedName(savedName);

        return pdfRepository.save(pdf);
    }

    public List<PdfFile> getAllPdfFiles() {
        return pdfRepository.findAll();
    }

    public String extractText(MultipartFile file) throws IOException {

        PDDocument document = Loader.loadPDF(file.getBytes());

        PDFTextStripper stripper = new PDFTextStripper();

        String text = stripper.getText(document);

        document.close();

        return text;
    }

    public String summarize(MultipartFile file) throws IOException {

        String text = extractText(file);

        return geminiService.summarize(text);
    }

}