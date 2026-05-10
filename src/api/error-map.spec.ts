import {

  ApiClientError,

  parseNestError,

  userFacingMessage,

} from './error-map';



describe('parseNestError', () => {

  it('401 usa mensagem fixa amigável', () => {

    const e = parseNestError(401, { message: 'ignored' });

    expect(e.userMessage).toMatch(/sessão/i);

    expect(e.status).toBe(401);

  });



  it('403 usa mensagem de permissão', () => {

    const e = parseNestError(403, {});

    expect(e.userMessage).toMatch(/permissão/i);

  });



  it('422 preserva mensagem do corpo quando existir', () => {

    const e = parseNestError(422, { message: 'Campo X inválido' });

    expect(e.userMessage).toContain('Campo X');

  });

});



describe('userFacingMessage', () => {

  it('prioriza ApiClientError', () => {

    const msg = userFacingMessage(

      new ApiClientError(400, 'X', 'Algo correu mal.'),

      'fallback',

    );

    expect(msg).toBe('Algo correu mal.');

  });



  it('não expõe mensagens que parecem sensíveis', () => {

    const msg = userFacingMessage(new Error('invalid bearer token xyz'), 'Erro genérico');

    expect(msg).toBe('Erro genérico');

  });

});

