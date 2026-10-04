import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const dbUrl = process.env.DATABASE_URL;

  console.log('--------------------------------------------------');
  console.log('⚔️  TESTE DIRETO DE CONEXÃO COM O MONGODB');
  console.log('--------------------------------------------------');

  if (!dbUrl) {
    console.error('❌ ERRO: DATABASE_URL não foi encontrada no arquivo .env!');
    process.exit(1);
  }

  if (dbUrl.includes('<db_password>')) {
    console.warn('⚠️  ATENÇÃO: A sua DATABASE_URL ainda contém "<db_password>".');
    console.warn('   Abra o arquivo .env e substitua "<db_password>" pela senha real do MongoDB Atlas.');
    console.log('--------------------------------------------------');
  }

  // Oculta a senha no log por segurança
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log(`🔌 Conectando a: ${maskedUrl}`);

  const prisma = new PrismaClient();

  const startTime = Date.now();
  try {
    console.log('⏳ Enviando comando de ping para o cluster...');
    const result = await prisma.$runCommandRaw({ ping: 1 });
    const elapsed = Date.now() - startTime;

    console.log(`✅ SUCESSO! Conexão estabelecida em ${elapsed}ms.`);
    console.log('📄 Resposta do MongoDB:', JSON.stringify(result));

    // Testa contagem simples de usuários
    const userCount = await prisma.user.count();
    console.log(`👥 Total de usuários cadastrados no banco: ${userCount}`);
    console.log('--------------------------------------------------');
    console.log('🎉 O banco de dados está pronto para receber requisições!');
  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    console.error(`❌ FALHA na conexão (${elapsed}ms):`);
    console.error(error.message || error);
    console.log('--------------------------------------------------');
    console.log('💡 Dicas de solução:');
    console.log(' 1. Verifique se trocou <db_password> no .env pela senha correta.');
    console.log(' 2. Verifique o "Network Access" no MongoDB Atlas (libere o IP ou use 0.0.0.0/0).');
    console.log(' 3. Verifique se o usuário tem privilégios de leitura e escrita (readWriteAnyDatabase).');
  } finally {
    await prisma.$disconnect();
  }
}

main();
