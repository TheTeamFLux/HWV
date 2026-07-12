package com.example.backend.controller;

import com.example.backend.entity.PdfFile;
import com.example.backend.service.PdfService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.entity.PdfFile;
import com.example.backend.service.PdfService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
@RestController
@RequestMapping("/pdf")
public class PdfController {

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @PostMapping("/upload")
    public String upload(@RequestParam MultipartFile file) throws IOException {

        PdfFile pdf = pdfService.upload(file);

        return pdf.getOriginalName() + " 업로드 성공!";
    }

    @PostMapping("/extract")
    public String extract(@RequestParam MultipartFile file) throws IOException {

        return pdfService.extractText(file);

    }
    @GetMapping("/list")
    public List<PdfFile> getPdfList() {
        return pdfService.getAllPdfFiles();
    }

    @PostMapping("/summary")
    public String summary(@RequestParam("file") MultipartFile file)
            throws IOException {

        return pdfService.summarize(file);
    }
}
