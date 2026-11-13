package com.tecno.tecnstock.service;

import com.tecno.tecnstock.model.Fornecedor;
import com.tecno.tecnstock.model.MovimentacaoEstoque;
import com.tecno.tecnstock.model.Produto;

import com.tecno.tecnstock.repository.FornecedorRepository;
import com.tecno.tecnstock.repository.MovimentacaoEstoqueRepository;
import com.tecno.tecnstock.repository.ProdutoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovimentacaoEstoqueService {

    @Autowired
    private MovimentacaoEstoqueRepository repository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private FornecedorRepository fornecedorRepository;


    // ==========================================
    // ENTRADA
    // ==========================================

    public MovimentacaoEstoque entrada(
            Integer idProduto,
            Integer quantidade,
            String observacao,
            String usuarioLogin
    ) {

        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Produto não encontrado"
                        )
                );


        Integer estoqueAtual =
                produto.getQuantidade() != null
                        ? produto.getQuantidade()
                        : 0;


        produto.setQuantidade(
                estoqueAtual + quantidade
        );


        produtoRepository.save(produto);


        MovimentacaoEstoque mov =
                new MovimentacaoEstoque();


        mov.setIdProduto(
                produto.getId()
        );

        mov.setNomeProduto(
                produto.getNome()
        );

        mov.setTipo(
                "ENTRADA"
        );

        mov.setQuantidade(
                quantidade
        );

        mov.setIdFornecedor(
                produto.getIdFornecedor()
        );

        mov.setUsuarioLogin(
                usuarioLogin
        );

        mov.setObservacao(
                observacao
        );

        mov.setDataMovimentacao(
                LocalDateTime.now()
        );


        // Buscar fornecedor
        if (produto.getIdFornecedor() != null) {

            Fornecedor fornecedor =
                    fornecedorRepository.findById(
                            produto.getIdFornecedor()
                    ).orElse(null);


            if (fornecedor != null) {

                mov.setFornecedorNome(
                        fornecedor.getNome()
                );

            }

        }


        if (mov.getFornecedorNome() == null) {

            mov.setFornecedorNome(
                    "Fornecedor não informado"
            );

        }


        return repository.save(mov);
    }


    // ==========================================
    // SAÍDA
    // ==========================================

    public MovimentacaoEstoque saida(
            Integer idProduto,
            Integer quantidade,
            String observacao,
            String usuarioLogin
    ) {

        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Produto não encontrado"
                        )
                );


        Integer estoqueAtual =
                produto.getQuantidade() != null
                        ? produto.getQuantidade()
                        : 0;


        if (estoqueAtual < quantidade) {

            throw new RuntimeException(
                    "Estoque insuficiente"
            );

        }


        // ------------------------------------------
        // FORNECEDOR
        // ------------------------------------------

        Fornecedor fornecedor = null;


        if (produto.getIdFornecedor() != null) {

            fornecedor =
                    fornecedorRepository.findById(
                            produto.getIdFornecedor()
                    ).orElse(null);

        }


        // ------------------------------------------
        // ATUALIZAR ESTOQUE
        // ------------------------------------------

        produto.setQuantidade(
                estoqueAtual - quantidade
        );


        produtoRepository.save(produto);


        // ------------------------------------------
        // CRIAR MOVIMENTAÇÃO
        // ------------------------------------------

        MovimentacaoEstoque mov =
                new MovimentacaoEstoque();


        mov.setIdProduto(
                produto.getId()
        );


        mov.setNomeProduto(
                produto.getNome()
        );


        mov.setTipo(
                "SAIDA"
        );


        mov.setQuantidade(
                quantidade
        );


        mov.setIdFornecedor(
                produto.getIdFornecedor()
        );


        if (fornecedor != null) {

            mov.setFornecedorNome(
                    fornecedor.getNome()
            );

        } else {

            mov.setFornecedorNome(
                    "Fornecedor não informado"
            );

        }


        mov.setUsuarioLogin(
                usuarioLogin
        );


        mov.setObservacao(
                observacao
        );


        mov.setDataMovimentacao(
                LocalDateTime.now()
        );


        return repository.save(mov);
    }


    // ==========================================
    // LISTAR SAÍDAS
    // ==========================================

    public List<MovimentacaoEstoque> listarSaidas() {

        return repository
                .findByTipoOrderByDataMovimentacaoDesc(
                        "SAIDA"
                );

    }

}